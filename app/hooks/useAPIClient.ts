import { createAPIClient } from "../../server/hono";
import { useRootLoaderData } from "./useRootLoaderData";

/**
 * A hook to get an API client instance on Browser side.
 */
export const useAPIClient = () => {
  const data = useRootLoaderData();

  return createAPIClient(new URL("/api", data.baseURL).toString());
};
