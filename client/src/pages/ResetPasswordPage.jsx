import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth";
import { Navigate, useSearchParams } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";

const ResetPasswordPage = () => {
  usePageTitle("Reset Password");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="bg-gray-900 h-full">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your new password below to reset your account password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResetPasswordForm token={token} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
