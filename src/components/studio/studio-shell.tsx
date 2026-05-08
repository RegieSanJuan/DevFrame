"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { ArrowUpRight, Eye, Layers, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { BuilderFormState } from "@/app/actions";
import type { PortfolioFormValues } from "@/lib/portfolio-schema";
import {
  parsePortfolioFormData,
  portfolioFormSchema,
} from "@/lib/portfolio-schema";
import type { PortfolioTemplate, TemplateSlug } from "@/lib/template-catalog";
import { formValuesToRecord } from "@/lib/studio-utils";
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
    });
  }, [canResumeSave, clerk, isLoaded, isSignedIn, onSave, onValidate]);

  return <>{children(trigger)}</>;
}

type StudioShellProps = {
  clerkEnabled: boolean;
  requestedTemplate: TemplateSlug | null;
  templates: readonly PortfolioTemplate[];
  saveAction: (prev: BuilderFormState, data: FormData) => Promise<BuilderFormState>;
};

export function StudioShell({
  clerkEnabled,
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
    clearDraft,
  } = useStudioDraft(requestedTemplate);

  const [isSaving, setIsSaving] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"editor" | "preview">("editor");
  const [saveState, setSaveState] = useState<BuilderFormState>({
    status: "idle",
  });

  const livePortfolio = useMemo(
    () => formValuesToRecord(formValues, templateSettings),
    [formValues, templateSettings],
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
      const result = await saveAction({ status: "idle" }, formData);
      setSaveState(result);

      if (result.status === "success") {
        clearDraft();
        clearPendingStudioSaveIntent();
      }
    } finally {
      setIsSaving(false);
    }
  }, [clearDraft, getValidatedFormData, saveAction]);

  const validateBeforeAuth = useCallback(() => {
    if (!isHydrated) {
      return false;
    }

    return Boolean(getValidatedFormData());
  }, [getValidatedFormData, isHydrated]);

  const sidebarProps = {
    clerkEnabled,
    formValues,
    isReady: isHydrated,
    isSaving,
    onFieldChange: updateField as <K extends keyof PortfolioFormValues>(
      key: K,
      value: PortfolioFormValues[K],
    ) => void,
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
          DevFrame Studio
        </Link>

        <div className="flex items-center gap-2">
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
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                mobilePanel === "editor"
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
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                mobilePanel === "preview"
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

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={`min-h-0 overflow-hidden border-white/5 bg-[#0d0d0d] ${
            mobilePanel === "preview" ? "hidden lg:flex" : "flex"
          } w-full lg:w-[28rem] xl:w-[31rem] lg:shrink-0 lg:border-r lg:flex-none ${
            mobilePanel === "preview" ? "" : "lg:flex"
          }`}
        >
          {clerkEnabled ? (
            <ClerkSaveBridge
              canResumeSave={isHydrated}
              onSave={executeSave}
              onValidate={validateBeforeAuth}
            >
              {(onSave) => <StudioSidebar {...sidebarProps} onSave={onSave} />}
            </ClerkSaveBridge>
          ) : (
            <StudioSidebar {...sidebarProps} onSave={() => void executeSave()} />
          )}
        </aside>

        <main
          className={`min-h-0 flex-1 overflow-hidden lg:min-w-0 ${
            mobilePanel === "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <StudioPreview portfolio={livePortfolio} />
        </main>
      </div>
    </div>
  );
}
