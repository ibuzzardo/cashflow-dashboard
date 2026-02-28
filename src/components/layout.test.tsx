import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const toggleTheme = vi.fn();

vi.mock("@/hooks/use-theme", () => ({
  useTheme: () => ({
    theme: "light" as const,
    toggleTheme,
    setTheme: vi.fn(),
  }),
}));

import Layout from "@/components/layout";

describe("Layout", () => {
  it("renders title and children", () => {
    render(
      <Layout>
        <div>Child content</div>
      </Layout>,
    );

    expect(screen.getByText("Cashflow Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("invokes theme toggle from button", async () => {
    const user = userEvent.setup();
    render(
      <Layout>
        <div>Child</div>
      </Layout>,
    );

    await user.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
