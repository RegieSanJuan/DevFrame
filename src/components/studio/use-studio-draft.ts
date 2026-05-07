"use client";

import { useCallback, useEffect, useReducer } from "react";

import {
  getEmptyPortfolioForm,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import { getTemplateSettingsDefaults } from "@/lib/template-field-registry";
import type { TemplateSlug } from "@/lib/template-catalog";

const DRAFT_KEY = "devframe:guest-draft";
const DRAFT_VERSION = 1 as const;

type StoredDraft = {
  version: typeof DRAFT_VERSION;
  savedAt: string;
  formValues: PortfolioFormValues;
  templateSettings: Record<string, unknown>;
};

type StudioDraftState = {
  formValues: PortfolioFormValues;
  templateSettings: Record<string, unknown>;
  isHydrated: boolean;
};

type StudioDraftAction =
  | {
      type: "hydrate";
      requestedTemplate: TemplateSlug | null;
    }
  | {
      type: "update-field";
      key: keyof PortfolioFormValues;
      value: PortfolioFormValues[keyof PortfolioFormValues];
    }
  | {
      type: "update-template-setting";
      key: string;
      value: unknown;
    }
  | {
      type: "switch-template";
      slug: TemplateSlug;
    };

function getDefaultState(templateSlug: TemplateSlug): StudioDraftState {
  const templateSettings = getTemplateSettingsDefaults(templateSlug);

  return {
    formValues: {
      ...getEmptyPortfolioForm(templateSlug),
      templateSettings,
    },
    templateSettings,
    isHydrated: false,
  };
}

function readStoredDraft(
  requestedTemplate: TemplateSlug | null,
  fallbackTemplate: TemplateSlug,
) {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);

    if (!raw) {
      return null;
    }

    const stored = JSON.parse(raw) as StoredDraft;

    if (stored.version !== DRAFT_VERSION || !stored.formValues) {
      return null;
    }

    const templateSlug = requestedTemplate ?? stored.formValues.templateSlug;
    const templateSettings =
      requestedTemplate && requestedTemplate !== stored.formValues.templateSlug
        ? getTemplateSettingsDefaults(requestedTemplate)
        : (stored.templateSettings ??
            stored.formValues.templateSettings ??
            getTemplateSettingsDefaults(templateSlug));

    return {
      formValues: {
        ...stored.formValues,
        templateSlug: templateSlug ?? fallbackTemplate,
        templateSettings,
      },
      templateSettings,
    };
  } catch {
    return null;
  }
}

function reducer(
  state: StudioDraftState,
  action: StudioDraftAction,
): StudioDraftState {
  switch (action.type) {
    case "hydrate": {
      const fallbackTemplate = state.formValues.templateSlug;

      if (typeof window === "undefined") {
        return {
          ...state,
          isHydrated: true,
        };
      }

      const stored = readStoredDraft(action.requestedTemplate, fallbackTemplate);

      if (!stored) {
        if (
          action.requestedTemplate &&
          action.requestedTemplate !== state.formValues.templateSlug
        ) {
          const templateSettings = getTemplateSettingsDefaults(action.requestedTemplate);

          return {
            formValues: {
              ...getEmptyPortfolioForm(action.requestedTemplate),
              templateSettings,
            },
            templateSettings,
            isHydrated: true,
          };
        }

        return {
          ...state,
          isHydrated: true,
        };
      }

      return {
        ...stored,
        isHydrated: true,
      };
    }

    case "update-field":
      return {
        ...state,
        formValues: {
          ...state.formValues,
          [action.key]: action.value,
        },
      };

    case "update-template-setting": {
      const templateSettings = {
        ...state.templateSettings,
        [action.key]: action.value,
      };

      return {
        ...state,
        formValues: {
          ...state.formValues,
          templateSettings,
        },
        templateSettings,
      };
    }

    case "switch-template": {
      const templateSettings = getTemplateSettingsDefaults(action.slug);

      return {
        ...state,
        formValues: {
          ...state.formValues,
          templateSlug: action.slug,
          templateSettings,
        },
        templateSettings,
      };
    }

    default:
      return state;
  }
}

export function useStudioDraft(requestedTemplate: TemplateSlug | null) {
  const fallbackTemplate = requestedTemplate ?? "nova";
  const [state, dispatch] = useReducer(
    reducer,
    fallbackTemplate,
    getDefaultState,
  );

  useEffect(() => {
    dispatch({
      type: "hydrate",
      requestedTemplate,
    });
  }, [requestedTemplate]);

  useEffect(() => {
    if (!state.isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      try {
        const draft: StoredDraft = {
          version: DRAFT_VERSION,
          savedAt: new Date().toISOString(),
          formValues: {
            ...state.formValues,
            templateSettings: state.templateSettings,
          },
          templateSettings: state.templateSettings,
        };

        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // Ignore storage failures.
      }
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [state.formValues, state.isHydrated, state.templateSettings]);

  const updateField = useCallback(
    <K extends keyof PortfolioFormValues>(key: K, value: PortfolioFormValues[K]) => {
      dispatch({
        type: "update-field",
        key,
        value,
      });
    },
    [],
  );

  const updateTemplateSettings = useCallback((key: string, value: unknown) => {
    dispatch({
      type: "update-template-setting",
      key,
      value,
    });
  }, []);

  const switchTemplate = useCallback((slug: TemplateSlug) => {
    dispatch({
      type: "switch-template",
      slug,
    });
  }, []);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  return {
    formValues: state.formValues,
    templateSettings: state.templateSettings,
    isHydrated: state.isHydrated,
    updateField,
    updateTemplateSettings,
    switchTemplate,
    clearDraft,
  };
}
