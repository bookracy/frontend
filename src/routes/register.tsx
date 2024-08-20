import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-ismobile";
import { createFileRoute } from "@tanstack/react-router";
import { randomWordsWithNumberQueryOptions } from "@/api/words";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { generateUser } from "@/api/backend/auth/signup";
import { Clipboard } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: Register,
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(randomWordsWithNumberQueryOptions);
  },
});

const displayNameSchema = z.object({
  displayName: z.string().min(1, { message: "Display name is required" }),
});

function Register() {
  const navigate = useNavigate();
  const { isMobile } = useIsMobile();
  const [isCopied, setIsCopied] = useState(false);
  const [uuid, setUuid] = useState("");

  const { data } = useSuspenseQuery(randomWordsWithNumberQueryOptions);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("1234 5678 9000").then(() => {
      console.log("Copied to clipboard");
      setIsCopied(true);
    }).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  };

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

  const form = useForm<z.infer<typeof displayNameSchema>>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: {
      displayName: data ?? "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({ displayName: data });
    }
  }, [data, form]);

  const handleDisplayName = (data: z.infer<typeof displayNameSchema>) => {
    mutate({ username: data.displayName });
  };

  return (
    <div className="flex h-full w-full justify-center items-center">
      <Card className={`${isMobile ? ("w-full") : ("w-2/5")}`}>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {uuid ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Generated Identifier</Label>
                <div className="w-full items-center justify-center relative">
                  <Input value={uuid} readOnly />
                  <button 
                    onClick={copyToClipboard} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                  >
                    <Clipboard />
                  </button>
                </div>
                <span className="text-sm">Copy the identifier above and use it to login</span>
              </div>

              <Button className="w-full"  disabled={!isCopied} onClick={() => navigate({ to: "/login" })}>
                Continue
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleDisplayName)}>
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
                <div className="flex justify-end pt-4">
                  <Button type="submit" loading={isPending} className={`${isMobile ? ("w-full") : (null)}`}>
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
