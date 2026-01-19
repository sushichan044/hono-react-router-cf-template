import { useSyncExternalStore } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const subscribe = () => () => {};

const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useIsHydrated = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
