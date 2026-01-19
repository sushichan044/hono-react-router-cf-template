import { useTransition } from "react";

import type { Route } from "./+types/_layout._index";

import { useAuth } from "../auth";
import { useNetworkBusy } from "../hooks/useNetworkBusy";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "example" },
    {
      content: "noindex, nofollow",
      name: "robots",
    },
  ];
};

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const { auth } = useAuth();
  const isNetworkBusy = useNetworkBusy();
  const disableLoginButton = isPending || isNetworkBusy;

  const handleSignIn = () => {
    startTransition(async () => {
      await auth.signIn.social({
        provider: "spotify",
        scopes: ["user-read-email", "user-read-currently-playing"],
      });
    });
  };

  return (
    <>
      <section className="overflow-hidden">
        <h1>Hello</h1>
        <button disabled={disableLoginButton} onClick={handleSignIn} type="button">
          Login
        </button>
      </section>
    </>
  );
}
