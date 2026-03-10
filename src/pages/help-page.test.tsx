import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/layout", () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="layout">{children}</div>,
}));

import HelpPage from "@/pages/help-page";

const QUESTIONS = {
  gettingStarted: "How do I add my first transaction?",
  account: "I forgot my password. What should I do?",
  billing: "Where can I view billing invoices?",
};

describe("HelpPage", () => {
  it("renders heading, search, tabs, and initial FAQ items", () => {
    render(<HelpPage />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByLabelText("Search frequently asked questions")).toBeInTheDocument();

    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Getting Started" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Billing" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: QUESTIONS.gettingStarted })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: QUESTIONS.account })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: QUESTIONS.billing })).toBeInTheDocument();
  });

  it("filters FAQs by selected category", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    await user.click(screen.getByRole("tab", { name: "Billing" }));

    expect(screen.getByRole("button", { name: QUESTIONS.billing })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.gettingStarted })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.account })).not.toBeInTheDocument();
  });

  it("filters FAQs by search text (case-insensitive)", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    await user.type(screen.getByLabelText("Search frequently asked questions"), "INVOICES");

    expect(screen.getByRole("button", { name: QUESTIONS.billing })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.gettingStarted })).not.toBeInTheDocument();
  });

  it("applies category and search filters together", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    await user.click(screen.getByRole("tab", { name: "Account" }));
    await user.type(screen.getByLabelText("Search frequently asked questions"), "password");

    expect(screen.getByRole("button", { name: QUESTIONS.account })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.gettingStarted })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.billing })).not.toBeInTheDocument();
  });

  it("expands and collapses an FAQ with proper aria-expanded state", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    const trigger = screen.getByRole("button", { name: QUESTIONS.gettingStarted });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/Open the dashboard and select Add Transaction/i)).toBeVisible();

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard interaction on FAQ toggle", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    const trigger = screen.getByRole("button", { name: QUESTIONS.gettingStarted });
    trigger.focus();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("shows empty state when no FAQs match current filters", async () => {
    const user = userEvent.setup();
    render(<HelpPage />);

    await user.type(screen.getByLabelText("Search frequently asked questions"), "no-match-text");

    expect(screen.getByText(/No FAQs match your current/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: QUESTIONS.gettingStarted })).not.toBeInTheDocument();
  });
});
