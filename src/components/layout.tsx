import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Help", href: "/dashboard/help" },
];

const getPathname = (): string => {
  if (typeof window === "undefined") {
    return "/dashboard";
  }

  return window.location.pathname;
};

const subscribePathname = (onStoreChange: () => void): (() => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handler = (): void => {
    onStoreChange();
  };

  window.addEventListener("popstate", handler);
  return () => {
    window.removeEventListener("popstate", handler);
  };
};

const navigate = (href: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname === href) {
    return;
  }

  window.history.pushState({}, "", href);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const pathname = useSyncExternalStore(subscribePathname, getPathname, () => "/dashboard");

  const onNavClick = (event: MouseEvent<HTMLAnchorElement>, href: string): void => {
    event.preventDefault();
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold tracking-tight">Cashflow Dashboard</h1>
          <nav aria-label="Primary" className="flex items-center gap-2">
            {NAV_ITEMS.map((item: NavItem) => {
              const isActive = pathname === item.href;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => onNavClick(event, item.href)}
                  aria-current={isActive ? "page" : undefined}
                  className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 active:scale-[0.98]"
                  data-state={isActive ? "active" : "inactive"}
                >
                  <span
                    className={
                      isActive
                        ? "text-white rounded-lg bg-blue-600 px-2 py-1"
                        : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                    }
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default Layout;
