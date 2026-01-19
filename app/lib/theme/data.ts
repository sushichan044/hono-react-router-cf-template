import type { Theme, ThemeConfig } from "./types";

// We using initTheme.toString(), so we cannot use storage key as a variable here
// BE CAREFUL WHEN RENAME IT
/**
 * @package
 */
export function initTheme() {
  const prefers: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const stored = localStorage.getItem("now-playing-app-color-mode");

  const theme: Theme =
    stored === "system" || stored == null ? prefers : stored === "light" ? "light" : "dark";

  // Same as setThemeData but without function call
  window.document.documentElement.dataset["theme"] = theme;
}

/**
 * @package
 */
export function setThemeDataSet(theme: Theme) {
  window.document.documentElement.dataset["theme"] = theme;
}

/**
 * @package
 */
export function getUserThemeConfig(fallback: ThemeConfig): ThemeConfig {
  let mode: string | null = null;

  try {
    mode = localStorage.getItem("now-playing-app-color-mode");
  } catch {
    // localStorage not supported
  }

  if (mode === "light" || mode === "dark" || mode === "system") {
    return mode;
  }

  return fallback;
}

/**
 * @package
 */
export function storeUserThemeConfig(mode: ThemeConfig) {
  try {
    localStorage.setItem("now-playing-app-color-mode", mode);
  } catch {
    // localStorage not supported
  }
}
