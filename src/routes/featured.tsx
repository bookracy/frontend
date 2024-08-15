import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/featured")({
  component: () => <div>Hello /featured!</div>,
});
