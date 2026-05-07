/**
 * Studio layout — fixed full-screen overlay covering the site header/footer.
 * The studio is a standalone app-like experience; it doesn't inherit the
 * marketing nav/footer from the root layout.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0a0a0a]">
      {children}
    </div>
  );
}
