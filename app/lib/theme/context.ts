import { createContext } from "react";

import type { Theme, ThemeConfig } from "./types";

type ThemeContextValue = {
  resolvedTheme: Theme | undefined;
  setThemeConfig: (config: ThemeConfig) => void;
  themeConfig: ThemeConfig | undefined;
};

/**
 * @package
 */
export const ThemeContext = createContext<ThemeContextValue | null>(null);
