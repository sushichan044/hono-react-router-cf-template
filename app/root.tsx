import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";

import "./app.css";
import { createBetterAuthClient } from "../shared/auth/client";
import { AuthReactContext } from "./auth";
import { authContext } from "./context.server";
import { ThemeProvider, ThemeScript } from "./lib/theme";

export const links: Route.LinksFunction = () => [
  { href: "https://fonts.googleapis.com", rel: "preconnect" },
  {
    crossOrigin: "anonymous",
    href: "https://fonts.gstatic.com",
    rel: "preconnect",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    rel: "stylesheet",
  },
];

export function loader({ context }: Route.LoaderArgs) {
  const auth = authContext.get(context);

  return {
    baseURL: auth.baseURL,
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <ThemeScript />
      </head>
      <body
        className="bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50"
        suppressHydrationWarning
      >
        {/* id=root is required for Base UI */}
        <div id="root">
          <ThemeProvider>{children}</ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const auth = createBetterAuthClient({ baseURL: loaderData.baseURL });

  return (
    <AuthReactContext value={{ auth }}>
      <Outlet />
    </AuthReactContext>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let title = "Something went wrong";
  let description = "An unexpected error occurred. Please try again later.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Page not found";
      description = "The page you're looking for doesn't exist or has been moved.";
    } else {
      title = `Error ${error.status}`;
      description = error.statusText || description;
    }
  }

  const isDev = import.meta.env.DEV && error instanceof Error;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center">
          {/* Error Status */}
          <div className="mb-8">
            <span className="text-8xl font-bold text-slate-200 dark:text-slate-800">{status}</span>
          </div>

          {/* Error Message */}
          <h1 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
          <p className="mb-8 text-slate-600 dark:text-slate-400">{description}</p>

          {/* Action Button */}
          <a
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white transition dark:bg-slate-50 dark:text-slate-900 hocus:bg-slate-800 dark:hocus:bg-slate-200"
            href="/"
          >
            Back to Home
          </a>

          {/* Dev Error Stack */}
          {isDev && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-slate-500">
                Error Details (dev only)
              </summary>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-100 p-4 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <code>{error.stack}</code>
              </pre>
            </details>
          )}
        </div>
      </main>
    </div>
  );
}
