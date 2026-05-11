export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex-1 flex w-full flex-col items-center justify-center p-6 sm:p-10">
      {children}
    </main>
  );
}
