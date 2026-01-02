import { resetPasswordSchema } from "@/lib/schema";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, Link } from "react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useResetPasswordMutation } from "app/hooks/use-auth";
import { toast } from "sonner";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [isTokenInvalid, setIsTokenInvalid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormData) => {
    resetPassword(
      { ...values, token: token as string },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: any) => {
          const status = error.response?.status;
          const message =
            error.response?.data?.message || "Something went wrong";

          if (
            status === 400 &&
            (message.includes("invalid") || message.includes("expired"))
          ) {
            toast.error(message);
            setIsTokenInvalid(true);
            return;
          }

          if (status === 401) {
            toast.error("Unauthorized reset request");
            setIsTokenInvalid(true);
            return;
          }

          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <h1 className="text-3xl font-extrabold text-center">
            Reset password
          </h1>
          <p className="text-muted-foreground text-center">
            Enter your new password below.
          </p>

          <Link to="/sign-in">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {isTokenInvalid ? (
            <div className="text-center space-y-3">
              <h2 className="text-xl font-bold">
                Reset link is invalid or expired
              </h2>
              <p className="text-muted-foreground">
                Please request a new password reset link.
              </p>
              <Link to="/forgot-password">
                <Button>Back to Forgot Password</Button>
              </Link>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle className="w-12 h-12 text-green-500" />

              <h2 className="text-xl font-bold">
                Password reset successfully!
              </h2>

              <p className="text-muted-foreground text-sm">
                You can now sign in with your new password.
              </p>

              <Link to="/sign-in" className="w-full">
                <Button className="w-full">Go to sign in</Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  <Loader2 className="w-4 h-4 mr-2 hidden" />
                  Reset password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
