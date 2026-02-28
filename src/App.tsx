import { useSyncExternalStore } from "react";

import DashboardPage from "@/pages/dashboard-page";
import HelpPage from "@/pages/help-page";

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

const App = (): JSX.Element => {
  const pathname = useSyncExternalStore(subscribePathname, getPathname, () => "/dashboard");

  if (pathname === "/dashboard/help") {
    return <HelpPage />;
  }

  return <DashboardPage />;
};

export default App;
