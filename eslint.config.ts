import react from "@virtual-live-lab/eslint-config/presets/react";
import importAccess from "eslint-plugin-import-access/flat-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
  react,
  {
    ignores: [".types/worker-configuration.d.ts"],
    name: "@repo/eslint-config/worker-configuration",
  },
  {
    name: "@repo/eslint-config/react-refresh-react-router",
    rules: {
      "react-refresh/only-export-components": [
        "error",
        { allowExportNames: ["meta", "links", "headers", "loader", "action", "middleware"] },
      ],
    },
  },
  {
    name: "@repo/eslint-config/import-access/plugin",
    plugins: {
      // @ts-expect-error type mismatch between ESLint and typescript-eslint
      "import-access": importAccess,
    },
  },
  {
    files: ["**/*.{ts,cts,mts,tsx}"],
    name: "@repo/eslint-config/import-access/rules",
    rules: {
      "import-access/jsdoc": "error",
    },
  },
);
