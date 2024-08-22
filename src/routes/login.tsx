import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useIsMobile } from "@/hooks/use-ismobile";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/backend/auth/signin";
import { useAuthStore } from "@/stores/auth";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TurnstileWidget } from "@/components/layout/turnstile";

export const Route = createFileRoute("/login")({
  component: Login,
});

const loginFormSchema = z.object({
  code: z.string({ message: "Code must be 12 digits" }).min(12, { message: "Code must be 12 digits" }).max(12, { message: "Code must be 12 digits" }),
  ttkn: z.string({ message: "Captcha not completed" }),
});

function InputOTPGroups() {
  const { isMobile } = useIsMobile();

  const createInputOTPGroups = (breakPoint: number) => {
    const groups = [];
    for (let i = 0; i < 12; i += breakPoint) {
      groups.push(
        <InputOTPGroup key={i}>
          {[...Array(breakPoint)].map((_, j) => (
            <InputOTPSlot key={j} index={i + j} />
          ))}
        </InputOTPGroup>,
      );
      groups.push(<InputOTPSeparator key={`separator-${i}`} />);
    }
    return groups.map((group, i) => (i === groups.length - 1 ? null : group));
  };

  return <div className="flex w-full flex-col items-center justify-center gap-2 lg:flex-row">{isMobile ? createInputOTPGroups(4) : createInputOTPGroups(6)}</div>;
}

function Login() {
  const { navigate } = useRouter();
  const setTokens = useAuthStore((state) => state.setTokens);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      toast.success("Logged in successfully");
      setTokens(data.access_token, data.refresh_token);
      navigate({ to: "/", search: { q: "" } });
    },
    onError: () => {
      toast.error("Failed to login", { duration: 10000 });
    },
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(data: z.infer<typeof loginFormSchema>) {
    mutate(data);
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-fit">
          <Card className="w-full lg:w-fit">
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>12 Digit Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={12} {...field}>
                        <InputOTPGroups />
                      </InputOTP>
                    </FormControl>
                    <FormDescription>Enter the 12-digit login code.</FormDescription>
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
                        {...field}
                        onSuccess={(token) => {
                          form.setValue("ttkn", token);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col justify-between gap-2 xl:flex-row xl:gap-0">
              <p className="text-sm">
                No account yet? Create one{" "}
                <Link to="/register" className="underline">
                  here
                </Link>
              </p>
              <Button loading={isPending} type="submit" className="w-full lg:w-fit">
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
