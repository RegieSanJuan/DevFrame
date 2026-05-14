"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { savePortfolioAction, type BuilderFormState } from "@/app/actions";
import {
  getTemplateSettingsDefaults,
} from "@/lib/template-field-registry";
import {
  portfolioFormSchema,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import { createFormData } from "@/utils/form-data";

type UsePortfolioBuilderFormOptions = {
  defaultValues: PortfolioFormValues;
  buildFormData?: (
    values: PortfolioFormValues,
    templateSettings: Record<string, unknown>,
  ) => FormData | Promise<FormData>;
};

export function usePortfolioBuilderForm({
  defaultValues,
  buildFormData,
}: UsePortfolioBuilderFormOptions) {
  const [submissionState, setSubmissionState] = useState<BuilderFormState>({
    status: "idle",
  });
  const [isPending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] = useState(
    defaultValues.templateSlug,
  );
  const [templateSettings, setTemplateSettings] = useState<Record<string, unknown>>(
    defaultValues.templateSettings ?? {},
  );

  const form = useForm<PortfolioFormValues>({
    // @ts-expect-error: zodResolver + Zod 4 .default() infers templateSettings as
    // optional in the resolver types but required in PortfolioFormValues. At runtime,
    // Zod's .default({}) guarantees it is always a Record — this is a type-inference gap only.
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      ...defaultValues,
      templateSettings: defaultValues.templateSettings ?? {},
    },
  });

  const submit = form.handleSubmit(() => {
    startTransition(async () => {
      try {
        const values = form.getValues();
        const formData = buildFormData
          ? await buildFormData(values, templateSettings)
          : createFormData({ ...values, templateSettings });
        const result = await savePortfolioAction(submissionState, formData);
        setSubmissionState(result);
      } catch (error) {
        setSubmissionState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Unable to save the portfolio.",
          persisted: false,
        });
      }
    });
  });

  const selectTemplate = (
    templateSlug: PortfolioFormValues["templateSlug"],
  ) => {
    setSelectedTemplate(templateSlug);
    form.setValue("templateSlug", templateSlug, { shouldValidate: true });
    // Reset template settings to sensible defaults for the new template
    setTemplateSettings(getTemplateSettingsDefaults(templateSlug));
  };

  return {
    form,
    isPending,
    selectTemplate,
    selectedTemplate,
    templateSettings,
    setTemplateSettings,
    submissionState,
    setSubmissionState,
    submit,
  };
}

