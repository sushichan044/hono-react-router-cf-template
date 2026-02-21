import type { FC } from "react";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import IconMoon from "~icons/fa7-regular/moon";
import IconSun from "~icons/fa7-regular/sun";
import IconDisplay from "~icons/fa7-solid/display";

import type { ThemeConfig } from "../../lib/theme/types";

import { useTheme } from "../../lib/theme";

const themes: Array<{ icon: FC<{ className?: string }>; label: string; value: ThemeConfig }> = [
  { icon: IconSun, label: "Light", value: "light" },
  { icon: IconDisplay, label: "System", value: "system" },
  { icon: IconMoon, label: "Dark", value: "dark" },
];

export const ThemeSwitcher: FC = () => {
  const { setThemeConfig, themeConfig } = useTheme();
  const themeConfigValue = themeConfig ? [themeConfig] : undefined;

  return (
    <ToggleGroup<ThemeConfig>
      aria-label="Theme"
      className="flex gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-700 dark:bg-slate-800"
      onValueChange={(value) => {
        if (value.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          setThemeConfig(value[0]!);
        }
      }}
      value={themeConfigValue}
    >
      {themes.map(({ icon: Icon, label, value }) => (
        <Toggle
          aria-label={label}
          className="flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors select-none hover:bg-slate-200 hover:text-slate-700 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-600 data-pressed:bg-white data-pressed:text-slate-900 data-pressed:shadow-sm dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 dark:data-pressed:bg-slate-700 dark:data-pressed:text-slate-50"
          key={value}
          value={value}
        >
          <Icon className="size-4" />
        </Toggle>
      ))}
    </ToggleGroup>
  );
};
