import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

type LayoutProps = {
  children: ReactNode;
};

const buttonClassName =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99] h-10 px-3 border border-muted/70 bg-white hover:bg-muted/40 dark:border-slate-700 dark:bg-slate-900";

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-muted/70 bg-background/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6 xl:px-8">
          <h1 className="text-lg font-semibold">Cashflow Dashboard</h1>
          <button type="button" className={buttonClassName} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6 xl:px-8 xl:py-8">{children}</main>
    </div>
  );
};

export default Layout;
