import { getSetupStatusItems } from "@/lib/setup-status";
import { SetupStatusClient } from "./setup-status-client";

export function SetupStatus() {
  return <SetupStatusClient initialItems={getSetupStatusItems()} />;
}
