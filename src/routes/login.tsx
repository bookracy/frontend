import { useState } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [code, setCode] = useState("");

  return (
    <div className="flex h-full w-full justify-center items-center">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>Login</CardTitle>
            <CardDescription className="flex flex-col gap-3">
              <Label>12 Digit Code</Label>
              <div className="flex items-center justify-center">
                <InputOTP maxLength={12} onChange={(code: string) => setCode(code)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={8} />
                    <InputOTPSlot index={9} />
                    <InputOTPSlot index={10} />
                    <InputOTPSlot index={11} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button disabled={code.replace(/\s/g, "").length !== 12}>Continue</Button>
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}