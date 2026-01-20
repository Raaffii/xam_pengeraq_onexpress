import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth";
import { usePageTitle } from "@/hooks/usePageTitle";

const ForgotPasswordPage = () => {
  usePageTitle("Forgot Password");

  return (
    <div className="bg-gray-900 h-full">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Forgot Your Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your registered email address to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
