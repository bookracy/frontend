import * as React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "@/components/ui/nav-link";
import { createFileRoute } from "@tanstack/react-router";
import { DISCORD_URL, GITHUB_URL } from "@/constants";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        <Card>
          <CardHeader>
            <CardTitle>About Bookracy 🌟</CardTitle>
            <CardDescription className="flex flex-col gap-8">
              Bookracy is a open-source project that aims to provide a platform for sharing and discovering books for free built with shadcn. Bookracy is currently a work in progress while we build
              out the features and functionality. We hope you enjoy the platform and find it useful. If you have any feedback or suggestions, please feel free to reach out to us.
              <div className="flex flex-row gap-1">
                <NavLink to={GITHUB_URL}>Github Repository</NavLink> |{" "}
                <NavLink to={DISCORD_URL} target="_blank">
                  Discord
                </NavLink>{" "}
                | <NavLink to="/contact">Contact</NavLink>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
