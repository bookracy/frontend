import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/random")({
  component: () => <div>Hello /random!</div>,
});
