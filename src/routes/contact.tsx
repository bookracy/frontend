import * as React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription className="flex flex-col gap-8">
              Bookracy is an open-source project driven by the community. The project is maintained by a group of developers and sending an email below will reach the maintainers (if checked).
              <br />
              DMCA takedown requests will be ignored. If you have a DMCA request, please contact the hosting provider.
              <Button onClick={() => window.open("mailto:dev@bookracy.org", "_blank")}>Email Us</Button>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
