import { use } from "react";

import { ThemeContext } from "./context";

/**
 * Hook to access the current theme and user preferences.
 *
 * @package
 */
export const useTheme = () => {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
