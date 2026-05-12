import type { Metadata } from "next";

import { CustomAccountSettings } from "@/components/auth/custom-account-settings";
import { requireViewer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your DevFrame account security settings.",
};

export default async function AccountPage() {
  await requireViewer();

  return (
    <section className="mx-auto w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <CustomAccountSettings />
      </div>
    </section>
  );
}
