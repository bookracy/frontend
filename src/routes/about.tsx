import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex h-full justify-center w-full">
      <div className="flex flex-col w-full">
        <Card>
          <CardHeader>
            <CardTitle>About Bookracy 🌟</CardTitle>
            <CardDescription className="flex flex-col gap-8">
              Bookracy is a open-source project that aims to provide a platform for sharing and discovering books for free built with shadcn. Bookracy is currently a work in progress while we build out the features and functionality. We hope you enjoy the platform and find it useful. If you have any feedback or suggestions, please feel free to reach out to us.
              <div className="flex flex-row gap-1">
                <a href="https://github.com/bookracy/frontend">Github Repository</a> | <a href="/discord">Discord</a> | <a href="/contact">Contact</a>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}