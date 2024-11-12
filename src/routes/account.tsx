import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settings";
import { useMutation } from "@tanstack/react-query";
import { syncUserData } from "@/api/backend/auth/sync";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/account")({
  component: Account,
  beforeLoad: (ctx) => {
    const beta = useSettingsStore.getState().beta;
    if (import.meta.env.PROD && !beta) throw redirect({ to: "/", search: { q: "" } });
    if (!ctx.context.auth.isLoggedIn) throw redirect({ to: "/login" });
  },
});

const updateDisplayNameSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
});

function Account() {
  const displayName = useAuthStore((state) => state.displayName);
  const setDisplayName = useAuthStore((state) => state.setDisplayName);

  const form = useForm<z.infer<typeof updateDisplayNameSchema>>({
    resolver: zodResolver(updateDisplayNameSchema),
    defaultValues: {
      displayName,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateDisplayName"],
    mutationFn: syncUserData,
    onSuccess: () => {
      setDisplayName(form.getValues().displayName);
      toast.success("Display name updated");
    },
    onError: () => {
      toast.error("Failed to update display name");
    },
  });

  const handleSubmit = (data: z.infer<typeof updateDisplayNameSchema>) => {
    mutate({ username: data.displayName });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-3/4 md:w-1/2 xl:w-1/3">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Form {...form}>
              <form className="flex items-center gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
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
                <Button type="submit" loading={isPending}>
                  Update
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
