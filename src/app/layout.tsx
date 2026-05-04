
import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Cavendish Voices | Student Portal',
  description: 'The official digital suggestion box for Cavendish University students.',
  icons: {
    icon: '/cavendish.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <FirebaseClientProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-md px-6 md:hidden">
                  <SidebarTrigger className="text-primary" />
                  <div className="flex flex-col ml-2">
                    <span className="font-headline font-bold text-sm tracking-tight text-primary leading-none">
                      Cavendish Voices
                    </span>
                  </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
