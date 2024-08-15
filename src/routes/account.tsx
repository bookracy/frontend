import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: () => Account,
});

function Account() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Account</h1>
    </div>
  );
}
