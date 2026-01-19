import { lastLoginMethodClient } from "better-auth/client/plugins";
import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient as _createAuthClient } from "better-auth/react";

type BetterAuthClientParams = {
  baseURL: string;
};

const clientPlugins = [lastLoginMethodClient(), usernameClient()];

export const createBetterAuthClient = (params: BetterAuthClientParams) => {
  return _createAuthClient({
    baseURL: params.baseURL,
    plugins: clientPlugins,
  });
};
