import { useEffect, useState } from "react";
import { redirect, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { randomWordsWithNumberQueryOptions } from "@/api/words";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { generateUser } from "@/api/backend/auth/signup";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ClipBoardButton } from "@/components/layout/clipboard-button";
import { TurnstileWidget } from "@/components/layout/turnstile";
import { useSettingsStore } from "@/stores/settings";
import { ImageUploader } from "@/components/ui/image-upload-field";

export const Route = createFileRoute("/register")({
  component: Register,
  beforeLoad: async (opts) => {
    const beta = useSettingsStore.getState().beta;
    if (!beta) throw redirect({ to: "/", search: { q: "" } });

    if (opts.context.auth.isLoggedIn) throw redirect({ to: "/account" });
    await opts.context.queryClient.ensureQueryData(randomWordsWithNumberQueryOptions);
  },
});

const profileRegistrationSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
  profilePicture: z
    .instanceof(File, { message: "Invalid file" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Please upload an image file",
    })
    .refine((file) => file.size <= 1024 * 1024, {
      message: "Please upload a file smaller than 1MB",
    })
    .optional(),
  ttkn: z.string({ message: "Captcha not completed" }),
});

function Register() {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [uuid, setUuid] = useState("");

  const { data } = useSuspenseQuery(randomWordsWithNumberQueryOptions);

  const { mutate, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: generateUser,
    onSuccess: (data) => {
      setUuid(data.code.replace(/\s/g, ""));
    },
    onError: () => {
      toast.error("Failed to create user", { duration: 10000 });
    },
  });

  const form = useForm<z.infer<typeof profileRegistrationSchema>>({
    resolver: zodResolver(profileRegistrationSchema),
    defaultValues: {
      displayName: data ?? "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({ displayName: data, profilePicture: undefined });
    }
  }, [data, form]);

  const handleSubmit = (data: z.infer<typeof profileRegistrationSchema>) => {
    mutate({
      username: data.displayName,
      pfp: data.profilePicture,
      ttkn: data.ttkn,
    });
  };

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full lg:w-3/5">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {uuid ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Generated Identifier</Label>
                <div className="relative w-full items-center justify-center">
                  <Input value={uuid} readOnly iconRight={<ClipBoardButton content={uuid} className="h-8 w-8 border-none" onClick={() => setIsCopied(true)} />} />
                </div>
                <span className="text-sm">Copy the identifier above and use it to login</span>
              </div>

              <Button className="w-full" disabled={!isCopied} onClick={() => navigate({ to: "/login" })}>
                Continue
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Set a display name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <ImageUploader value={field.value} onChange={(file) => field.onChange(file)} disabled={isPending} className="mx-auto" />
                      </FormControl>
                      <FormDescription>Upload a profile picture. Recommended aspect ratio: 16:9.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ttkn"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TurnstileWidget
                          id={field.name}
                          onSuccess={(token) => {
                            form.setValue("ttkn", token);
                          }}
                          onExpire={() => form.setError("ttkn", { message: "Captcha expired" })}
                          onError={() => form.setError("ttkn", { message: "Captcha not completed" })}
                          onUnsupported={() => form.setError("ttkn", { message: "Captcha not supported" })}
                          onTimeout={() => form.setError("ttkn", { message: "Captcha timed out" })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={isPending} className="w-full lg:w-fit">
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
