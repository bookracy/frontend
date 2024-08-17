import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: Account,
});

function Account() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Coming soon! ⏱️</CardTitle>
            <CardDescription className="flex flex-col gap-8">
              Sorry, Bookracy is a work in progress and this feature is not yet available. Come back later and maybe it will be 😉
              <Link to="/?q=">
                <Button className="w-full">Go Back</Button>
              </Link>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
