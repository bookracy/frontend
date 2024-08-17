import * as React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "@/components/ui/nav-link";
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
                <NavLink href="https://github.com/bookracy/frontend">Github Repository</NavLink> | <NavLink href="/discord">Discord</NavLink> | <NavLink href="/contact">Contact</NavLink>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}