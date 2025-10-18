import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import authClient from "@/lib/auth";

export const Route = createFileRoute("/_auth_forms")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (session.data) {
      throw redirect({
        to: "/todos",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
