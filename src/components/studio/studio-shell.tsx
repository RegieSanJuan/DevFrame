"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { ArrowUpRight, Eye, Layers, Monitor, PanelLeftClose, PanelLeftOpen, SlidersHorizontal, Smartphone } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { BuilderFormState } from "@/app/actions";
import { usePortfolioImageUploads } from "@/hooks/use-portfolio-image-uploads";
import type { PortfolioFormValues } from "@/lib/portfolio-schema";
import {
  parsePortfolioFormData,
  portfolioFormSchema,
} from "@/lib/portfolio-schema";
import { formValuesToRecord } from "@/lib/studio-utils";
import type { PortfolioTemplate, TemplateSlug } from "@/lib/template-catalog";
import { createFormData } from "@/utils/form-data";

import { StudioPreview } from "./studio-preview";
import { StudioSidebar } from "./studio-sidebar";
import { useStudioDraft } from "./use-studio-draft";

const SAVE_INTENT_KEY = "devframe:studio-save-intent";

function getStudioReturnUrl() {
  if (typeof window === "undefined") {
    return "/studio";
  }

  return `${window.location.pathname}${window.location.search}`;
}

function hasPendingStudioSaveIntent() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.sessionStorage.getItem(SAVE_INTENT_KEY) === "1";
}

function setPendingStudioSaveIntent() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SAVE_INTENT_KEY, "1");
}

function clearPendingStudioSaveIntent() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SAVE_INTENT_KEY);
}

function ClerkSaveBridge({
  canResumeSave,
  onSave,
  onValidate,
  children,
}: {
  canResumeSave: boolean;
  onSave: () => Promise<void>;
  onValidate: () => boolean;
  children: (trigger: () => void) => React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const clerk = useClerk();

  useEffect(() => {
    if (!canResumeSave || !isLoaded || !isSignedIn || !hasPendingStudioSaveIntent()) {
      return;
    }

    clearPendingStudioSaveIntent();
    void onSave();
  }, [canResumeSave, isLoaded, isSignedIn, onSave]);

  const trigger = useCallback(() => {
    if (!canResumeSave || !onValidate() || !isLoaded) {
      return;
    }

    if (isSignedIn) {
      clearPendingStudioSaveIntent();
      void onSave();
      return;
    }

    const returnUrl = getStudioReturnUrl();
    setPendingStudioSaveIntent();
    clerk.openSignIn({
      fallbackRedirectUrl: returnUrl,
      forceRedirectUrl: returnUrl,
      signUpFallbackRedirectUrl: returnUrl,
      signUpForceRedirectUrl: returnUrl,
    });
  }, [canResumeSave, clerk, isLoaded, isSignedIn, onSave, onValidate]);

  return <>{children(trigger)}</>;
}

type StudioShellProps = {
  clerkEnabled: boolean;
  initialValues: PortfolioFormValues | null;
  requestedTemplate: TemplateSlug | null;
  templates: readonly PortfolioTemplate[];
  saveAction: (prev: BuilderFormState, data: FormData) => Promise<BuilderFormState>;
};

export function StudioShell({
  clerkEnabled,
  initialValues,
  requestedTemplate,
  templates,
  saveAction,
}: StudioShellProps) {
  const {
    formValues,
    templateSettings,
    isHydrated,
    updateField,
    updateTemplateSettings,
    switchTemplate,
    replaceDraft,
  } = useStudioDraft(requestedTemplate, initialValues);

  const [isSaving, setIsSaving] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"editor" | "preview">("editor");
  const [showSidebar, setShowSidebar] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [scale, setScale] = useState(1);
  const [saveState, setSaveState] = useState<BuilderFormState>({
    status: "idle",
  });

  const handleFieldChange = useCallback(
    <K extends keyof PortfolioFormValues>(key: K, value: PortfolioFormValues[K]) => {
      updateField(key, value);
    },
    [updateField],
  );
  const imageUploads = usePortfolioImageUploads(formValues, handleFieldChange);
  const previewValues = useMemo(
    () => imageUploads.applyPreviewValues(formValues),
    [formValues, imageUploads],
  );
  const livePortfolio = useMemo(
    () => formValuesToRecord(previewValues, templateSettings),
    [previewValues, templateSettings],
  );

  const getValidatedFormData = useCallback(() => {
    const formData = createFormData({
      ...formValues,
      templateSettings,
    } as Record<string, unknown>);
    const parsed = portfolioFormSchema.safeParse(parsePortfolioFormData(formData));

    if (!parsed.success) {
      setSaveState({
        status: "error",
        message:
          parsed.error.issues[0]?.message ?? "Please fix the form errors and try again.",
      });
      return null;
    }

    return formData;
  }, [formValues, templateSettings]);

  const executeSave = useCallback(async () => {
    const formData = getValidatedFormData();

    if (!formData) {
      clearPendingStudioSaveIntent();
      return;
    }

    setIsSaving(true);

    try {
      const submitFormData = await imageUploads.createSubmitFormData(
        formValues,
        templateSettings,
      );
      const result = await saveAction({ status: "idle" }, submitFormData);
      setSaveState(result);

      if (result.status === "success" && result.persisted && result.savedValues) {
        replaceDraft(
          result.savedValues,
          result.savedValues.templateSettings ?? {},
        );
        imageUploads.clearPendingUploads();
        clearPendingStudioSaveIntent();
      }
    } catch (error) {
      setSaveState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload images or save the portfolio.",
        persisted: false,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    formValues,
    getValidatedFormData,
    imageUploads,
    replaceDraft,
    saveAction,
    templateSettings,
  ]);

  const validateBeforeAuth = useCallback(() => {
    if (!isHydrated) {
      return false;
    }

    return Boolean(getValidatedFormData());
  }, [getValidatedFormData, isHydrated]);

  const sidebarProps = {
    clerkEnabled,
    formValues,
    imageUploads,
    isReady: isHydrated,
    isSaving,
    onFieldChange: handleFieldChange,
    onTemplateSettingChange: updateTemplateSettings,
    onTemplateSwitch: switchTemplate as (slug: TemplateSlug) => void,
    saveState,
    templateSettings,
    templates,
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#0d0d0d] px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
        >
          <Layers className="size-4 text-accent" />
          Studio
        </Link>

        <div className="flex items-center gap-2">

          <div className="hidden items-center gap-3 lg:flex">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${device === "desktop"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
                  }`}
              >
                <Monitor className="size-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${device === "mobile"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/70"
                  }`}
              >
                <Smartphone className="size-3.5" />
                Mobile
              </button>

              <div className="mx-1 h-4 w-px bg-white/10" />

              <span className="px-2 font-mono text-[10px] font-medium tracking-tight text-white/30">
                {Math.round(scale * 100)}%
              </span>
            </div>
          </div>

          {livePortfolio.slug && livePortfolio.slug !== "preview" ? (
            <Link
              href={`/p/${livePortfolio.slug}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:text-white/80 sm:flex"
            >
              /p/{livePortfolio.slug}
              <ArrowUpRight className="size-3" />
            </Link>
          ) : null}

          <div className="flex rounded-full border border-white/10 bg-white/5 p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobilePanel("editor")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${mobilePanel === "editor"
                ? "bg-white/10 text-white"
                : "text-white/45 hover:text-white/70"
                }`}
            >
              <span className="flex items-center gap-1.5">
                <SlidersHorizontal className="size-3" />
                Editor
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobilePanel("preview")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${mobilePanel === "preview"
                ? "bg-white/10 text-white"
                : "text-white/45 hover:text-white/70"
                }`}
            >
              <span className="flex items-center gap-1.5">
                <Eye className="size-3" />
                Preview
              </span>
            </button>
          </div>

          <span className="hidden rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 sm:inline-flex">
            {isHydrated ? "Draft restored" : "Loading"}
          </span>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={`relative min-h-0 ${mobilePanel === "preview" ? "hidden lg:flex" : "flex"
            } ${showSidebar ? "lg:w-[28rem] xl:w-[31rem]" : "lg:w-0"
            } w-full lg:shrink-0 lg:flex-none transition-all duration-300 ease-in-out`}
        >
          {/* Pull-tab trigger */}
          <button
            type="button"
            onClick={() => setShowSidebar(!showSidebar)}
            className="absolute -right-6 top-4 z-50 flex h-12 w-6 items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-[#0d0d0d] text-white/40 shadow-xl transition hover:text-white focus:outline-none lg:flex"
            title={showSidebar ? "Hide sidebar" : "Show sidebar"}
          >
            {showSidebar ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </button>

          <div className={`h-full w-[28rem] xl:w-[31rem] shrink-0 overflow-hidden border-white/5 bg-[#0d0d0d] lg:border-r transition-opacity duration-300 ${showSidebar ? "opacity-100" : "opacity-0"
            }`}>
            <div className="h-full w-full overflow-y-auto">
              {clerkEnabled ? (
                <ClerkSaveBridge
                  canResumeSave={isHydrated}
                  onSave={executeSave}
                  onValidate={validateBeforeAuth}
                >
                  {(onSave) => (
                    <StudioSidebar {...sidebarProps} onSave={onSave} />
                  )}
                </ClerkSaveBridge>
              ) : (
                <StudioSidebar
                  {...sidebarProps}
                  onSave={() => void executeSave()}
                />
              )}
            </div>
          </div>
        </aside>

        <main
          className={`min-h-0 flex-1 overflow-hidden lg:min-w-0 ${mobilePanel === "editor" ? "hidden lg:block" : "block"
            }`}
        >
          <div className="relative flex h-full flex-col items-center justify-center w-full">
            <StudioPreview
              portfolio={livePortfolio}
              device={device}
              onScaleChange={setScale}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
