'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { useFirebase, initiateGoogleSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { auth, user, isUserLoading } = useFirebase();
  const logoImage = PlaceHolderImages.find(img => img.id === 'university-logo');

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header strip */}
            <div className="bg-primary px-8 py-10 text-center">
              {logoImage && (
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-2xl bg-white p-2 shadow-lg">
                    <Image
                      src={logoImage.imageUrl}
                      alt={logoImage.description}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <h1 className="font-headline font-bold text-2xl text-white leading-tight">
                Cavendish Voices
              </h1>
              <p className="text-white/70 text-sm mt-1">Student Feedback Portal</p>
            </div>

            {/* Body */}
            <div className="px-8 py-8 text-center">
              <h2 className="font-headline font-bold text-xl text-primary mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Sign in with your Cavendish University Google account to access the feedback portal.
              </p>

              <Button
                onClick={() => initiateGoogleSignIn(auth)}
                className="w-full h-12 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm rounded-xl font-semibold gap-3"
                variant="outline"
              >
                {/* Google G logo */}
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </Button>

              <p className="text-xs text-muted-foreground mt-6">
                Use your <span className="font-semibold text-primary">@cavendish.ac.ug</span> university email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
