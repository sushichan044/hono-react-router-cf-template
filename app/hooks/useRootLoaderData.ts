import { useRouteLoaderData } from "react-router";

import type { Route } from "../../.react-router/types/app/+types/root";

export const useRootLoaderData = (): Route.ComponentProps["loaderData"] => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useRouteLoaderData("root")!;
};
