import { useSyncExternalStore } from "react";

export const useMatchMedia = (query: string, fallback = false) => {
  const mediaQueryList = typeof window !== "undefined" ? window.matchMedia(query) : null;

  return useSyncExternalStore(
    (tryRender) => {
      mediaQueryList?.addEventListener("change", tryRender);
      return () => {
        mediaQueryList?.removeEventListener("change", tryRender);
      };
    },
    () => mediaQueryList?.matches ?? fallback,
    () => fallback,
  );
};
