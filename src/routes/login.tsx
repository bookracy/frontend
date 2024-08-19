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

export const Route = createFileRoute("/login")({
  component: Login,
});

const loginFormSchema = z.object({
  code: z.string({ message: "Code must be 12 digits" }).min(12, { message: "Code must be 12 digits" }).max(12, { message: "Code must be 12 digits" }),
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

  return <div className="flex w-full flex-col items-center justify-center gap-2 xl:flex-row">{isMobile ? createInputOTPGroups(4) : createInputOTPGroups(6)}</div>;
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            <CardFooter className="flex-col justify-between gap-2 xl:flex-row xl:gap-0">
              <Link to="/register" className="text-sm underline">
                No account yet? Create one here
              </Link>
              <Button loading={isPending} type="submit">
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
