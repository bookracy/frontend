import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createFileRoute, redirect, useRouteContext } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settings";
import { useMutation } from "@tanstack/react-query";
import { syncUserData } from "@/api/backend/auth/sync";
import { toast } from "sonner";
import { ImageUploader } from "@/components/ui/image-upload-field";

export const Route = createFileRoute("/account")({
  component: Account,
  beforeLoad: (ctx) => {
    const beta = useSettingsStore.getState().beta;
    if (import.meta.env.PROD && !beta) throw redirect({ to: "/", search: { q: "" } });
    if (!ctx.context.auth.isLoggedIn) throw redirect({ to: "/login" });
  },
});

const updateAccountSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
  profilePicture: z
    .union([z.string(), z.instanceof(File)])
    .refine(
      (file) => {
        if (typeof file === "string") return true;
        return file.type.startsWith("image/");
      },
      {
        message: "Please upload a valid image file",
      },
    )
    .refine(
      (file) => {
        if (typeof file === "string") return true;
        return file.size <= 1024 * 1024;
      },
      {
        message: "Please upload a file smaller than 1MB",
      },
    )
    .optional(),
});

function Account() {
  const user = useRouteContext({
    from: "__root__",
  }).auth.user;

  const form = useForm<z.infer<typeof updateAccountSchema>>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      displayName: user?.username || "",
      profilePicture: user?.pfp || "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["updateDisplayName"],
    mutationFn: syncUserData,
    onSuccess: () => {
      toast.success("Account updated");
    },
    onError: () => {
      toast.error("Failed to update account");
    },
  });

  const handleSubmit = (data: z.infer<typeof updateAccountSchema>) => {
    mutate({ username: data.displayName, pfp: data.profilePicture ?? "" });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-3/4 md:w-1/2 xl:w-1/3">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent className="p-4 py-0">
              <div className="flex flex-col gap-4">
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
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile picture</FormLabel>
                      <FormControl>
                        <ImageUploader value={field.value} onChange={(file) => field.onChange(file)} disabled={isPending} className="mx-auto" />
                      </FormControl>
                      <FormDescription>Change your profile picture</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <CardFooter className="justify-end pt-4">
                <Button type="submit" loading={isPending}>
                  Update
                </Button>
              </CardFooter>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
}
