import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const readmePath = path.resolve(process.cwd(), "README.md");
const readme = fs.readFileSync(readmePath, "utf8");

describe("README", () => {
  it("documents key product sections", () => {
    const sections = [
      "# cashflow-dashboard",
      "## Features",
      "## Architecture Overview",
      "## Component Map",
      "## Environment Variables",
      "## Scripts",
      "## Manual QA Checklist",
    ];

    for (const section of sections) {
      expect(readme).toContain(section);
    }
  });

  it("documents npm-only scripts", () => {
    expect(readme).toContain("- `npm install`");
    expect(readme).toContain("- `npm run dev`");
    expect(readme).toContain("- `npm run build`");
    expect(readme).toContain("- `npm run test`");
    expect(readme).toContain("- `npm run lint`");

    expect(readme).not.toMatch(/\b(yarn|pnpm)\b/i);
  });

  it("lists architecture paths that exist in the repository", () => {
    const listedPaths = [
      "src/pages",
      "src/components/dashboard",
      "src/components/theme",
      "src/components/ui",
      "src/lib/schemas",
      "src/lib/types",
      "src/lib/api",
      "src/hooks",
      "src/styles",
      "src/test",
    ];

    for (const relativePath of listedPaths) {
      const absolutePath = path.resolve(process.cwd(), relativePath);
      expect(fs.existsSync(absolutePath)).toBe(true);
    }
  });

  it("includes required environment variable names", () => {
    expect(readme).toContain("NEXT_PUBLIC_API_BASE_URL");
    expect(readme).toContain("NEXT_PUBLIC_TRANSACTIONS_MODE");
  });
});
