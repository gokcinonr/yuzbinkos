import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main className="flex-1 pt-20 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
