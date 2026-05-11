import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DevframeLogo } from "@/components/marketing/app-icon";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background relative overflow-hidden">
      {/* Subtle decorative background blur */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <header className="w-full flex items-center justify-between p-6 sm:p-10 max-w-7xl mx-auto z-10">
        <DevframeLogo />
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
      </header>

      <main className="flex-1 flex w-full flex-col items-center justify-center p-6 sm:p-10 -mt-20 z-0">
        {children}
      </main>
    </div>
  );
}

