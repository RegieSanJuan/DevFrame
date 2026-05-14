import {
  getSetupStatusItems,
  isSetupDiagnosticsEnabled,
} from "@/lib/setup-status";
import { SetupStatusClient } from "./setup-status-client";

export function SetupStatus() {
  if (!isSetupDiagnosticsEnabled) {
    return null;
  }

  return <SetupStatusClient initialItems={getSetupStatusItems()} />;
}
