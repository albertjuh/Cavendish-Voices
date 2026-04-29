
"use client"

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MessageSquare, LayoutDashboard, Home, Send, Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Submit Suggestion', href: '/submit', icon: Send },
  { name: 'View Suggestions', href: '/suggestions', icon: MessageSquare },
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const logoImage = PlaceHolderImages.find(img => img.id === 'university-logo');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
                {logoImage && (
                  <Image
                    src={logoImage.imageUrl}
                    alt={logoImage.description}
                    width={56}
                    height={56}
                    className="object-contain"
                    data-ai-hint={logoImage.imageHint}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-xl tracking-tight text-primary leading-none">
                  Cavendish
                </span>
                <span className="font-headline font-semibold text-lg text-secondary leading-none">
                  Voices
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                    pathname === item.href
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2 animate-in slide-in-from-top duration-300">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-3 py-3 rounded-md text-base font-medium flex items-center gap-3",
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
