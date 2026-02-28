import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import viteConfig from "../vite.config";
import tailwindConfig from "../tailwind.config";
import postcssConfig from "../postcss.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

describe("repository config", () => {
  it("package.json contains expected scripts and module type", () => {
    const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf-8")) as {
      type: string;
      scripts: Record<string, string>;
    };

    expect(pkg.type).toBe("module");
    expect(pkg.scripts.dev).toBe("vite");
    expect(pkg.scripts.build).toContain("vite build");
    expect(pkg.scripts.test).toBe("vitest run");
  });

  it("tsconfig enforces strictness and alias", () => {
    const tsconfig = JSON.parse(readFileSync(path.join(root, "tsconfig.json"), "utf-8")) as {
      compilerOptions: {
        strict: boolean;
        noImplicitAny: boolean;
        noUncheckedIndexedAccess: boolean;
        paths: Record<string, string[]>;
      };
    };

    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
    expect(tsconfig.compilerOptions.noUncheckedIndexedAccess).toBe(true);
    expect(tsconfig.compilerOptions.paths["@/*"]).toEqual(["src/*"]);
  });

  it("vite config includes react, alias, and jsdom test environment", () => {
    expect(viteConfig.resolve?.alias).toHaveProperty("@");
    expect(viteConfig.test?.environment).toBe("jsdom");
    expect(viteConfig.test?.globals).toBe(true);
  });

  it("tailwind config declares class-based dark mode and content globs", () => {
    expect((tailwindConfig as { darkMode: string[] }).darkMode).toEqual(["class"]);
    expect((tailwindConfig as { content: string[] }).content).toContain("./src/**/*.{ts,tsx}");

    const colors = (tailwindConfig as { theme: { extend: { colors: Record<string, unknown> } } }).theme.extend.colors;
    expect(colors).toHaveProperty("primary");
    expect(colors).toHaveProperty("destructive");
  });

  it("postcss config enables tailwindcss and autoprefixer", () => {
    const plugins = (postcssConfig as { plugins: Record<string, unknown> }).plugins;
    expect(plugins).toHaveProperty("tailwindcss");
    expect(plugins).toHaveProperty("autoprefixer");
  });

  it("index.html includes root mount point and main entry script", () => {
    const html = readFileSync(path.join(root, "index.html"), "utf-8");

    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('src="/src/main.tsx"');
    expect(html).toContain("<title>Cashflow Dashboard</title>");
  });

  it(".env.example contains VITE and NEXT_PUBLIC transaction env vars", () => {
    const env = readFileSync(path.join(root, ".env.example"), "utf-8");

    expect(env).toContain("VITE_API_BASE_URL=");
    expect(env).toContain("VITE_TRANSACTIONS_MODE=");
    expect(env).toContain("NEXT_PUBLIC_API_BASE_URL=");
    expect(env).toContain("NEXT_PUBLIC_TRANSACTIONS_MODE=");
  });
});
