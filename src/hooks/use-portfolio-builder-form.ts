"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { savePortfolioAction, type BuilderFormState } from "@/app/actions";
import {
  portfolioFormSchema,
  type PortfolioFormValues,
} from "@/lib/portfolio-schema";
import { createFormData } from "@/utils/form-data";

type UsePortfolioBuilderFormOptions = {
  defaultValues: PortfolioFormValues;
};

export function usePortfolioBuilderForm({
  defaultValues,
}: UsePortfolioBuilderFormOptions) {
  const [submissionState, setSubmissionState] = useState<BuilderFormState>({
    status: "idle",
  });
  const [isPending, startTransition] = useTransition();
  const [selectedTemplate, setSelectedTemplate] = useState(
    defaultValues.templateSlug,
  );
  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues,
  });

  const submit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await savePortfolioAction(
        submissionState,
        createFormData(values),
      );
      setSubmissionState(result);
    });
  });

  const selectTemplate = (
    templateSlug: PortfolioFormValues["templateSlug"],
  ) => {
    setSelectedTemplate(templateSlug);
    form.setValue("templateSlug", templateSlug, { shouldValidate: true });
  };

  return {
    form,
    isPending,
    selectTemplate,
    selectedTemplate,
    submissionState,
    submit,
  };
}
