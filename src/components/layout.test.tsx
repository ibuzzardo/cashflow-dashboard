import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Layout from "@/components/layout";

describe("Layout", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/dashboard");
    vi.restoreAllMocks();
  });

  it("renders children and primary nav links", () => {
    render(
      <Layout>
        <main>Child content</main>
      </Layout>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Help" })).toBeInTheDocument();
  });

  it("marks the active nav item based on pathname", () => {
    window.history.pushState({}, "", "/dashboard/help");

    render(
      <Layout>
        <div>Body</div>
      </Layout>,
    );

    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });

  it("navigates to a different route when clicking a non-active link", async () => {
    const user = userEvent.setup();
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    render(
      <Layout>
        <div>Body</div>
      </Layout>,
    );

    await user.click(screen.getByRole("link", { name: "Help" }));

    expect(pushStateSpy).toHaveBeenCalledWith({}, "", "/dashboard/help");
    expect(dispatchSpy).toHaveBeenCalled();
    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });

  it("does not push history when clicking the already active route", async () => {
    const user = userEvent.setup();
    const pushStateSpy = vi.spyOn(window.history, "pushState");
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    render(
      <Layout>
        <div>Body</div>
      </Layout>,
    );

    await user.click(screen.getByRole("link", { name: "Dashboard" }));

    expect(pushStateSpy).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("updates active nav when popstate is dispatched externally", () => {
    render(
      <Layout>
        <div>Body</div>
      </Layout>,
    );

    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");

    act(() => {
      window.history.pushState({}, "", "/dashboard/help");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByRole("link", { name: "Help" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Dashboard" })).not.toHaveAttribute("aria-current");
  });
});
