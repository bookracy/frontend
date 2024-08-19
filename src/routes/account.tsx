import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/account")({
  component: Account,
  beforeLoad: (ctx) => {
    if (!ctx.context.auth.isLoggedIn) throw redirect({ to: "/login" });
  },
});

const updateDisplayNameSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
});

function Account() {
  const navigate = useNavigate();
  const reset = useAuthStore((state) => state.reset);

  const form = useForm<z.infer<typeof updateDisplayNameSchema>>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: {
      displayName: "",
    },
  });

  const handleLogout = () => {
    reset();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-3/4">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              {/* TODO: Connect updating with backend */}
              <form className="flex items-center gap-4" onSubmit={form.handleSubmit((data) => console.log(data))}>
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Change your display name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Update</Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete account
          </Button>
          <Button onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
