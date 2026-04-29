
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Footer() {
  const logoImage = PlaceHolderImages.find(img => img.id === 'university-logo');

  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 mb-4 group inline-flex">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white p-1 shadow-sm transition-transform group-hover:scale-105">
                {logoImage && (
                  <Image
                    src={logoImage.imageUrl}
                    alt={logoImage.description}
                    width={48}
                    height={48}
                    className="object-contain"
                    data-ai-hint={logoImage.imageHint}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg tracking-tight leading-none text-white">
                  Cavendish
                </span>
                <span className="font-headline font-semibold text-base text-secondary leading-none">
                  Voices
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Improving student participation, transparency, and service delivery through digital feedback.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
              <Linkedin className="h-5 w-5 cursor-pointer hover:text-secondary transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 border-b border-primary-foreground/20 pb-2 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/" className="hover:text-secondary transition-colors">Home</Link></li>
              <li><Link href="/submit" className="hover:text-secondary transition-colors">Submit Suggestion</Link></li>
              <li><Link href="/suggestions" className="hover:text-secondary transition-colors">View Suggestions</Link></li>
              <li><Link href="/admin" className="hover:text-secondary transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 border-b border-primary-foreground/20 pb-2 text-white">University</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><a href="#" className="hover:text-secondary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Admissions</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Student Portal</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Library</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 border-b border-primary-foreground/20 pb-2 text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Cavendish University Campus, Main Road</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+256 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@cavendish.ac.ug</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Cavendish University. All rights reserved. Designed for Final Year Excellence.</p>
        </div>
      </div>
    </footer>
  );
}
