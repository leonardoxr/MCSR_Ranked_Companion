'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(username, privateKey || undefined);
      router.push('/my-stats');
    } catch (err) {
      // Error is already handled by the store
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) {
      clearError();
    }
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKey(e.target.value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login to MCSR Ranked</CardTitle>
        <CardDescription>
          Enter your Minecraft username to view your stats and track your progress
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Minecraft Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
              disabled={isLoading}
              className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              autoFocus
              autoComplete="username"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="privateKey" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Private Key (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {showPrivateKey ? 'Hide' : 'Show'} Info
              </button>
            </div>
            <Input
              id="privateKey"
              type="password"
              placeholder="Enter private key for live match data access (optional)"
              value={privateKey}
              onChange={handlePrivateKeyChange}
              disabled={isLoading}
              autoComplete="off"
            />
            {showPrivateKey && (
              <p className="text-xs text-muted-foreground">
                Private keys are used to access live match data for your account. 
                To get a private key, make a ticket in the{' '}
                <a
                  href="https://discord.gg/mcsrranked"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  MCSR Ranked Discord server
                </a>
                .
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? 'Validating...' : 'Login'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
