import { describe, expectTypeOf, it } from "vitest";

import type { Notification } from "../src/types/notification";

describe("Notification type", () => {
  it("enforces the expected shape", () => {
    const notification: Notification = {
      id: "n-100",
      title: "Sample title",
      message: "Sample message",
      type: "info",
      timestamp: "2026-02-28T08:00:00.000Z",
      read: false,
    };

    expectTypeOf(notification.id).toBeString();
    expectTypeOf(notification.title).toBeString();
    expectTypeOf(notification.message).toBeString();
    expectTypeOf(notification.type).toEqualTypeOf<"info" | "warning" | "error">();
    expectTypeOf(notification.timestamp).toBeString();
    expectTypeOf(notification.read).toBeBoolean();
  });
});
