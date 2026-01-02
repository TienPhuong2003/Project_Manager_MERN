import React, { use, useState, useEffect } from "react";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgotPasswordMutation } from "app/hooks/use-auth";
import { toast } from "sonner";
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { mutate: forgotPassword, isPending } = useForgotPasswordMutation();
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    forgotPassword(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Something went wrong";
        console.error(error);
        toast.error(errorMessage);
      },
    });
  };
  const handleResend = () => {
    const email = form.getValues("email");
    if (!email) return;

    setIsResending(true);
    forgotPassword(
      { email },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success("Reset email resent successfully");
          setCooldown(30)
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Could not resend email"
          );
        },
        onSettled: () => {
          setIsResending(false);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <h1 className="text-3xl font-extrabold text-center">
            Forgot password
          </h1>
          <p className="text-muted-foreground text-center">
            Enter your email below to reset your password.
          </p>

          <Link to="/sign-in">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle className="w-12 h-12 text-green-500" />

              <h2 className="text-xl font-bold">Password reset email sent!</h2>

              <p className="text-muted-foreground text-sm">
                Check your inbox. Didn’t receive the email?
              </p>

              <Button
                variant="outline"
                disabled={cooldown > 0 || isResending}
                onClick={handleResend}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
