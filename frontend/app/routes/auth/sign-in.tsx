import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@/lib/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type SignInFormData = z.infer<typeof signInSchema>;
const SignIn = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = (values: SignInFormData) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Please sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot Password?
                    </Link>
                    </div>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
              type="submit"
              className="w-full"
            >
              Sign In
            </Button>
            </form>
          </Form>
        
          <CardFooter className="flex justify-center items-center mt-4">
             <div className="justify-center text-center flex">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{"   "}
                  <Link to="/sign-up" className="text-blue-600 hover:underline font-semibold">
                    Sign Up
                  </Link>
                </p>
            </div>  
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
