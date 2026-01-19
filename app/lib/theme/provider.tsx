import { type FC, useLayoutEffect } from "react";
import { useEffect, useState } from "react";

import type { Theme, ThemeConfig } from "./types";

import { useMatchMedia } from "../../hooks/useMatchMedia";
import { ThemeContext } from "./context";
import { getUserThemeConfig, setThemeDataSet, storeUserThemeConfig } from "./data";

/**
 * @package
 */
export const ThemeProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const userPrefersDark = useMatchMedia("(prefers-color-scheme: dark)", false);

  // Avoid setting initial value until calculate layout on browser to avoid hydration mismatch
  const [themeConfig, _setThemeConfig] = useState<ThemeConfig>();
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    _setThemeConfig(getUserThemeConfig("system"));
  }, []);

  const systemTheme: Theme = userPrefersDark ? "dark" : "light";
  const resolvedTheme: Theme | undefined = themeConfig === "system" ? systemTheme : themeConfig;

  useEffect(() => {
    if (resolvedTheme) {
      setThemeDataSet(resolvedTheme);
    }
  }, [resolvedTheme]);

  const setThemeConfig = (config: ThemeConfig) => {
    _setThemeConfig(config);

    storeUserThemeConfig(config);
  };

  return (
    <ThemeContext value={{ resolvedTheme, setThemeConfig, themeConfig }}>{children}</ThemeContext>
  );
};
