import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth";

const LoginPage = () => {
  return (
    <div
      className='min-h-screen flex items-center justify-center 
  bg-gradient-to-br from-primarygray via-gray-800 to-black px-4'>
      <Card className='w-full max-w-md bg-white/80'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
