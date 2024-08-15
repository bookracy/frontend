import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/upload")({
  component: () => <div>Hello /upload!</div>,
});
