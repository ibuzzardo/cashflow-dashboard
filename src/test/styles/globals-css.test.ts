import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const globalsCssPath = path.resolve(process.cwd(), "src/styles/globals.css");
const css = fs.readFileSync(globalsCssPath, "utf8");

describe("globals.css", () => {
  it("defines both light and dark theme token blocks", () => {
    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");

    const requiredTokens = [
      "--background:",
      "--foreground:",
      "--card:",
      "--card-foreground:",
      "--border:",
      "--input:",
      "--ring:",
      "--muted:",
      "--muted-foreground:",
      "--primary:",
      "--primary-foreground:",
      "--secondary:",
      "--secondary-foreground:",
      "--accent:",
      "--accent-foreground:",
      "--destructive:",
      "--destructive-foreground:",
    ];

    for (const token of requiredTokens) {
      expect(css).toContain(token);
    }
  });

  it("applies expected global base styles", () => {
    expect(css).toContain("* {");
    expect(css).toContain("border-color: rgb(var(--border));");
    expect(css).toContain("html,");
    expect(css).toContain("body {");
    expect(css).toContain("min-height: 100%;");
  });

  it("keeps typography and smoothing contract on body", () => {
    expect(css).toContain("font-family: Manrope, ui-sans-serif, system-ui, sans-serif;");
    expect(css).toContain("-webkit-font-smoothing: antialiased;");
    expect(css).toContain("-moz-osx-font-smoothing: grayscale;");
  });

  it("includes transition for background/color/border theme switching", () => {
    expect(css).toMatch(/transition:\s*[\s\S]*background-color 200ms ease,[\s\S]*color 200ms ease,[\s\S]*border-color 200ms ease;/m);
  });
});
