import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <h3>Welcome Home!</h3>
      <Button>Hii</Button>
    </div>
  );
}
