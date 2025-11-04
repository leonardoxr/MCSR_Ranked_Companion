'use client';

import * as React from 'react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Eye, EyeOff, Save, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PrivateKeyManager() {
  const router = useRouter();
  const { privateKey, setPrivateKey, clearPrivateKey } = useAuthStore();
  const [localPrivateKey, setLocalPrivateKey] = React.useState(privateKey || '');
  const [showPrivateKey, setShowPrivateKey] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);

  React.useEffect(() => {
    setLocalPrivateKey(privateKey || '');
  }, [privateKey]);

  const handleSave = () => {
    setPrivateKey(localPrivateKey);
  };

  const handleClear = () => {
    setLocalPrivateKey('');
    clearPrivateKey();
  };

  const hasChanges = localPrivateKey !== (privateKey || '');

  return (
    <Card variant="mc">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Private Key Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="privateKey" className="text-sm font-medium">
              Private Key (Optional)
            </label>
            <button
              type="button"
              onClick={() => setShowInfo(!showInfo)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {showInfo ? 'Hide' : 'Show'} Info
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="privateKey"
                type={showPrivateKey ? 'text' : 'password'}
                placeholder="Enter private key for live match data access"
                value={localPrivateKey}
                onChange={(e) => setLocalPrivateKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPrivateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {hasChanges && (
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
            {privateKey && (
              <Button onClick={handleClear} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          {showInfo && (
            <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted rounded-md">
              <p>
                Private keys are used to access live match data for your account.
              </p>
              <p>
                To get a private key, make a ticket in the{' '}
                <a
                  href="https://discord.gg/mcsrranked"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  MCSR Ranked Discord server
                  <ExternalLink className="h-3 w-3" />
                </a>
                .
              </p>
            </div>
          )}
        </div>

        {privateKey && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/live-match')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Live Match Data
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

