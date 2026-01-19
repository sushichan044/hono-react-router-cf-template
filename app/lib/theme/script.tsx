import { initTheme } from "./data";

/**
 * @package
 */
export const ThemeScript = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${initTheme.toString()})();`,
      }}
    />
  );
};
