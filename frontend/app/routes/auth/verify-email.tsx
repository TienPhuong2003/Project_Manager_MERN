import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowLeft, CheckCircle, Loader, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "app/hooks/use-auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending: isVerying } = useVerifyEmailMutation();
  const token = searchParams.get("token");
  useEffect(() => {
    if (token) {
      mutate({ token },{
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || "Something went wrong";
          setIsSuccess(false);
          console.log(error);

          toast.error(errorMessage);
        },
      });
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p className="text-sm text-gray-500">Verifying your email address...</p>

      <Card className="w-full max-w-md">
        {/* <CardHeader>
          <Link
            to="/sign-in"
            className="flex items-center text-sm text-primary hover:underline gap-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to sign in
          </Link>
        </CardHeader> */}

        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            {isVerying ? (
              <>
                <Loader className="w-12 h-12 text-gray-500 mb-4 animate-spin" />
                <h3 className="text-lg font-semibold mb-2 text-gray-600">
                  Verifying your email...
                </h3>
                <p className="text-sm text-gray-500">
                  Please wait while we verify your email address.
                </p>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Email Verified Successfully!
                </h3>
                <p className="text-sm text-gray-500">
                  You can now sign in to your account.
                </p>
                <Link
                  to="/sign-in"
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            ) : (
              <>
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  Email Verification Failed
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  Your verification link is invalid or has expired. Please try
                  again.
                </p>
                <Link
                  to="/sign-in"
                  className="mt-6 text-sm text-primary hover:underline"
                >
                  <Button variant="outline">Back to Sign in</Button>
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
