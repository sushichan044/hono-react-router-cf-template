import type { MiddlewareFunction } from "react-router";

import { redirect } from "react-router";

import { authContext } from "./context.server";

export const requireLogin: MiddlewareFunction<Response> = ({ context }) => {
  const auth = authContext.get(context);
  if (!auth.context) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect("/");
  }
};
