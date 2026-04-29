import type { SetupStatusResponse } from "@/lib/setup-status";
import { apiClient } from "@/services/api-client";

export function fetchSetupStatus() {
  return apiClient.get<SetupStatusResponse>("/api/setup-status", {
    cache: "no-store",
  });
}
