import { useMemo, useState } from "react";

import Layout from "@/components/layout";
import type { Notification } from "@/types/notification";

type NotificationFilter = "all" | Notification["type"];

const FILTER_OPTIONS: ReadonlyArray<{ label: string; value: NotificationFilter }> = [
  { label: "All", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

const TYPE_ICON: Record<Notification["type"], string> = {
  info: "i",
  warning: "!",
  error: "x",
};

const TYPE_BADGE_CLASS: Record<Notification["type"], string> = {
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200",
};

export const mockNotifications: Notification[] = [
  {
    id: "n-1",
    title: "Budget synced",
    message: "Your latest account balances are now available.",
    type: "info",
    timestamp: "2026-02-28T08:00:00.000Z",
    read: false,
  },
  {
    id: "n-2",
    title: "Large expense detected",
    message: "A transaction above your alert threshold was recorded.",
    type: "warning",
    timestamp: "2026-02-27T19:10:00.000Z",
    read: false,
  },
  {
    id: "n-3",
    title: "Import failed",
    message: "We could not process one CSV row. Please review and retry.",
    type: "error",
    timestamp: "2026-02-27T13:30:00.000Z",
    read: true,
  },
  {
    id: "n-4",
    title: "Monthly summary ready",
    message: "Your February cashflow summary has been generated.",
    type: "info",
    timestamp: "2026-02-26T21:00:00.000Z",
    read: true,
  },
  {
    id: "n-5",
    title: "Category limit nearing",
    message: "Food spending is at 90% of your configured monthly target.",
    type: "warning",
    timestamp: "2026-02-25T17:45:00.000Z",
    read: false,
  },
];

export const filterNotificationsByType = (
  notifications: Notification[],
  type: NotificationFilter,
): Notification[] => {
  if (type === "all") {
    return notifications;
  }

  return notifications.filter((notification: Notification) => notification.type === type);
};

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

const NotificationsPage = (): JSX.Element => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");

  const filteredNotifications = useMemo((): Notification[] => {
    return filterNotificationsByType(notifications, activeFilter);
  }, [notifications, activeFilter]);

  const markAllRead = (): void => {
    setNotifications((current: Notification[]): Notification[] => {
      return current.map((notification: Notification): Notification => ({
        ...notification,
        read: true,
      }));
    });
  };

  const allRead = notifications.every((notification: Notification): boolean => notification.read);

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <main className="mx-auto w-full max-w-5xl p-4 md:p-6">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">System updates, warnings, and alerts</p>
            </div>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
              onClick={markAllRead}
              disabled={allRead}
            >
              Mark All Read
            </button>
          </header>

          <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex w-full flex-wrap gap-2 rounded-lg bg-slate-100 p-1 md:w-auto dark:bg-slate-900">
              {FILTER_OPTIONS.map((option: { label: string; value: NotificationFilter }) => (
                <button
                  key={option.value}
                  type="button"
                  className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeFilter === option.value
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                      : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                  onClick={(): void => setActiveFilter(option.value)}
                  aria-pressed={activeFilter === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3 md:space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">No notifications for this type.</p>
              </div>
            ) : (
              filteredNotifications.map((notification: Notification) => (
                <article
                  key={notification.id}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:bg-slate-50 focus-within:ring-2 focus-within:ring-blue-500 md:p-5 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      aria-label={`${notification.type} notification`}
                    >
                      {TYPE_ICON[notification.type]}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold md:text-base">{notification.title}</h2>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${TYPE_BADGE_CLASS[notification.type]}`}
                        >
                          {notification.type}
                        </span>
                        {!notification.read ? (
                          <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                            Unread
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{notification.message}</p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
