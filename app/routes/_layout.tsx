import { Outlet } from "react-router";

export default function StaticLayout() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <Outlet />
    </main>
  );
}
