"use client";

import { useEffect, useState } from "react";

import type { SetupStatusItem } from "@/lib/setup-status";
import { fetchSetupStatus } from "@/services/api/setup-status-api";

type SetupStatusState = {
  items: SetupStatusItem[];
  isRefreshing: boolean;
  error: string | null;
};

export function useSetupStatus(initialItems: SetupStatusItem[]) {
  const [state, setState] = useState<SetupStatusState>({
    items: initialItems,
    isRefreshing: true,
    error: null,
  });

  useEffect(() => {
    let isActive = true;

    void fetchSetupStatus()
      .then(({ items }) => {
        if (!isActive) {
          return;
        }

        setState({
          items,
          isRefreshing: false,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setState((current) => ({
          ...current,
          isRefreshing: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to refresh setup status.",
        }));
      });

    return () => {
      isActive = false;
    };
  }, []);

  return state;
}
