import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import Icons from "unplugin-icons/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig, lazyPlugins } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

import { configureLocalNetwork, configureSourcemapPerEnvironment } from "./dev/vite-plugin";

export default defineConfig((env) => ({
  fmt: {
    ignorePatterns: ["pnpm-lock.yaml", "**/*/worker-configuration.d.ts", "shared/db/migrations/**"],
    jsdoc: {
      commentLineStrategy: "multiline",
    },
    sortImports: true,
    sortTailwindcss: {
      stylesheet: "./app/app.css",
    },
  },

  lint: {
    env: {
      browser: true,
      es2026: true,
      node: true,
      worker: true,
    },
    jsPlugins: ["vite-plus/oxlint-plugin"],
    categories: {
      correctness: "error",
      nursery: "error",
      perf: "error",
    },
    options: {
      typeAware: true,
      typeCheck: false,
    },
    rules: {
      "import/consistent-type-specifier-style": "error",
      "typescript/array-type": ["error", { default: "array-simple" }],
      "typescript/ban-ts-comment": "error",
      "typescript/consistent-type-assertions": "error",
      "typescript/consistent-type-imports": "error",
      "typescript/no-misused-promises": "error",
      "typescript/no-explicit-any": "error",
      "typescript/no-unnecessary-type-assertion": "error",
      "typescript/no-unnecessary-type-conversion": "error",
      "typescript/no-unsafe-call": "error",
      "typescript/non-nullable-type-assertion-style": "error",
      "node/no-path-concat": "error",
      "unicorn/custom-error-definition": "error",
      "unicorn/switch-case-braces": "error",
      "typescript/switch-exhaustiveness-check": "error",
      "oxc/branches-sharing-code": "error",
      "unicorn/consistent-assert": "error",
      "typescript/no-confusing-void-expression": "error",
      "unicorn/prefer-date-now": "error",
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    overrides: [
      {
        files: ["**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        rules: {
          // Vitest fixtures require an object-destructuring first parameter; allow `({}, use) => {}`.
          "no-empty-pattern": ["error", { allowObjectPatternsAsParameters: true }],
        },
      },
    ],
  },

  plugins: lazyPlugins(() => [
    configureLocalNetwork(),
    configureSourcemapPerEnvironment({
      ssr: {
        build: "hidden",
        serve: true,
      },
    }),

    reactRouter(),
    // we should place cloudflare vite plugin after reactRouter
    env.mode !== "test" && cloudflare({ viteEnvironment: { name: "ssr" } }),

    babel({
      presets: [reactCompilerPreset()],
    }),
    Icons({
      compiler: "jsx",
      jsx: "react",
    }),
    devtoolsJson(),
    tailwindcss(),
  ]),

  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          environment: "node",
          include: ["**/*.node.test.{ts,tsx}"],
          name: "node",
        },
      },
      {
        test: {
          browser: {
            enabled: true,
            headless: true,
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
            provider: playwright(),
          },
          include: ["**/*.browser.test.{ts,tsx}"],
          name: "browser",
          setupFiles: ["./test/setup-react-browser.ts"],
        },
      },
    ],
  },

  run: {
    tasks: {
      build: {
        command: "react-router build",
      },

      check: {
        command: ["vp check", "tsgo -b --noEmit"],
        dependsOn: ["generate"],
      },

      "check:fix": {
        command: ["vp check --fix", "tsgo -b --noEmit"],
        dependsOn: ["generate"],
      },

      generate: {
        command: ["echo 'generate completed'"],
        dependsOn: ["generate:types", "generate:auth"],
      },

      "generate:types": {
        command: [
          "wrangler types --env-interface CloudflareBindings .types/worker-configuration.d.ts",
          "react-router typegen",
        ],
      },

      "generate:auth": {
        command: [
          "auth generate --config dev/auth.ts --output shared/db/auth-schema.ts -y",
          "vp check --fix shared/db/auth-schema.ts",
        ],
        input: ["dev/auth.ts", "pnpm-lock.yaml"],
        output: ["shared/db/auth-schema.ts"],
      },
    },
  },
}));
