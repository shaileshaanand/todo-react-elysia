import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import authClient from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/todos")({
  component: RouteComponent,
  loader: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw new Error("Unauthorized");
    }
    return session.data;
  },
});

function RouteComponent() {
  const session = Route.useLoaderData();
  const navigate = Route.useNavigate();
  return (
    <div>
      Hello {session.user.name}!
      <Button
        onClick={() => {
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                navigate({ to: "/login" });
              },
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
}
