import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <main className="pb-8 max-w-6xl w-full px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
