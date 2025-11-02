import { Metadata } from 'next';
import { LoginForm } from '@/components/features/LoginForm';

export const metadata: Metadata = {
  title: 'Login | MCSR Ranked Companion',
  description: 'Login with your Minecraft username to access your stats and track your MCSR Ranked progress',
};

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
