import { describe, expect, it } from "vitest";

import { filterNotificationsByType, mockNotifications } from "../src/pages/notifications-page";
import type { Notification } from "../src/types/notification";

const notificationsFixture: Notification[] = [
  {
    id: "t-1",
    title: "Info item",
    message: "Informational notice",
    type: "info",
    timestamp: "2026-02-28T10:00:00.000Z",
    read: false,
  },
  {
    id: "t-2",
    title: "Warning item",
    message: "Warning notice",
    type: "warning",
    timestamp: "2026-02-28T11:00:00.000Z",
    read: true,
  },
  {
    id: "t-3",
    title: "Error item",
    message: "Error notice",
    type: "error",
    timestamp: "2026-02-28T12:00:00.000Z",
    read: false,
  },
  {
    id: "t-4",
    title: "Second info",
    message: "Another informational notice",
    type: "info",
    timestamp: "2026-02-28T13:00:00.000Z",
    read: true,
  },
];

describe("filterNotificationsByType", () => {
  it("returns all notifications when filter is all", () => {
    const result = filterNotificationsByType(notificationsFixture, "all");

    expect(result).toHaveLength(4);
    expect(result.map((notification: Notification) => notification.id)).toEqual(["t-1", "t-2", "t-3", "t-4"]);
  });

  it("returns the exact same array reference when filter is all", () => {
    const result = filterNotificationsByType(notificationsFixture, "all");

    expect(result).toBe(notificationsFixture);
  });

  it("returns only info notifications", () => {
    const result = filterNotificationsByType(notificationsFixture, "info");

    expect(result).toHaveLength(2);
    expect(result.map((notification: Notification) => notification.id)).toEqual(["t-1", "t-4"]);
  });

  it("returns only warning notifications", () => {
    const result = filterNotificationsByType(notificationsFixture, "warning");

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("t-2");
  });

  it("returns only error notifications", () => {
    const result = filterNotificationsByType(notificationsFixture, "error");

    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe("t-3");
  });

  it("returns an empty array when no notifications match the selected type", () => {
    const warningsOnlyFixture: Notification[] = [
      {
        id: "w-1",
        title: "Warning",
        message: "Only warning present",
        type: "warning",
        timestamp: "2026-02-28T14:00:00.000Z",
        read: false,
      },
    ];

    const result = filterNotificationsByType(warningsOnlyFixture, "error");

    expect(result).toHaveLength(0);
  });

  it("does not mutate the input array", () => {
    const before = notificationsFixture.map((notification) => notification.id);

    filterNotificationsByType(notificationsFixture, "warning");

    expect(notificationsFixture.map((notification) => notification.id)).toEqual(before);
  });

  it("preserves source order when filtering", () => {
    const result = filterNotificationsByType(mockNotifications, "warning");

    expect(result.map((notification) => notification.id)).toEqual(["n-2", "n-5"]);
  });

  it("handles empty input arrays", () => {
    const resultAll = filterNotificationsByType([], "all");
    const resultInfo = filterNotificationsByType([], "info");

    expect(resultAll).toEqual([]);
    expect(resultInfo).toEqual([]);
  });
});

describe("mockNotifications", () => {
  it("contains unique notification ids", () => {
    const ids = mockNotifications.map((notification) => notification.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("contains at least one notification of every type", () => {
    const types = new Set(mockNotifications.map((notification) => notification.type));

    expect(types.has("info")).toBe(true);
    expect(types.has("warning")).toBe(true);
    expect(types.has("error")).toBe(true);
  });

  it("uses parseable ISO timestamps", () => {
    for (const notification of mockNotifications) {
      expect(Number.isNaN(Date.parse(notification.timestamp))).toBe(false);
    }
  });
});
