import DashboardPage from "@/pages/dashboard-page";
import NotificationsPage from "@/pages/notifications-page";

const getCurrentPath = (): string => {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname;
};

const App = (): JSX.Element => {
  const currentPath = getCurrentPath();

  if (currentPath === "/dashboard/notifications") {
    return <NotificationsPage />;
  }

  return <DashboardPage />;
};

export default App;
