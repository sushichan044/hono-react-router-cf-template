import { use } from "react";
import { createContext } from "react";

import type { createBetterAuthClient } from "../shared/auth/client";

type ClientAuthContextValue = {
  auth: ReturnType<typeof createBetterAuthClient>;
};

export const AuthReactContext = createContext<ClientAuthContextValue | null>(null);

export const useAuth = () => {
  const c = use(AuthReactContext);
  if (!c) {
    throw new Error("useAuth must be used within an AuthReactContext");
  }

  return c;
};
