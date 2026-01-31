/// <reference types="vitest/config" />

import type { PluginOptions as ReactCompilerPluginOptions } from "babel-plugin-react-compiler";

import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import babel from "vite-plugin-babel";
import devtoolsJson from "vite-plugin-devtools-json";

import { configureLocalNetwork, configureSourcemapPerEnvironment } from "./dev/vite-plugin";

const usage = process.env["VITEST"] === "true" ? "vitest" : "vite";

export default defineConfig({
  build: {
    cssMinify: "lightningcss",
  },
  css: {
    transformer: "lightningcss",
  },
  plugins:
    usage === "vite"
      ? [
          configureLocalNetwork(),
          configureSourcemapPerEnvironment({
            ssr: {
              build: "hidden",
              serve: true,
            },
          }),
          reactRouter(),
          // we should place cloudflare vite plugin after reactRouter
          cloudflare({ viteEnvironment: { name: "ssr" } }),
          babel({
            babelConfig: {
              plugins: [
                ["babel-plugin-react-compiler", {} satisfies ReactCompilerPluginOptions],
                "@babel/plugin-syntax-jsx",
              ],
              presets: ["@babel/preset-typescript"],
            },
            filter: /\.[jt]sx?$/,
          }),
          Icons({
            compiler: "jsx",
            jsx: "react",
          }),
          devtoolsJson(),
          tailwindcss(),
        ]
      : [
          reactRouter(),
          Icons({
            compiler: "jsx",
            jsx: "react",
          }),
          tailwindcss(),
        ],
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
});
