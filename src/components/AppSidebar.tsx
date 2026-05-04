
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Send,
  MessageSquare,
  BarChart3,
  Phone,
  HelpCircle,
  ChevronRight,
  LogOut,
  LogIn,
  User as UserIcon,
  ShieldCheck
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { cn } from "@/lib/utils"
import { useFirebase, initiateGoogleSignIn, initiateSignOut } from "@/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainNav = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Submit Voice', href: '/submit', icon: Send },
  { name: 'Suggestion Feed', href: '/suggestions', icon: MessageSquare },
]

const adminNav = [
  { name: 'Admin Command', href: '/admin', icon: BarChart3 },
]

const supportNav = [
  { name: 'Contact Us', href: '/contact', icon: Phone },
  { name: 'Help & FAQ', href: '#', icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { auth, user, isUserLoading } = useFirebase()
  const logoImage = PlaceHolderImages.find(img => img.id === 'university-logo')
  
  const [clickCount, setClickCount] = React.useState(0)
  const [isAdminVisible, setIsAdminVisible] = React.useState(false)

  const handleLogoClick = (e: React.MouseEvent) => {
    const nextCount = clickCount + 1
    if (nextCount >= 3) {
      setIsAdminVisible(true)
    }
    setClickCount(nextCount)
  }

  const handleSignIn = () => {
    if (auth) initiateGoogleSignIn(auth);
  }

  const handleSignOut = () => {
    if (auth) initiateSignOut(auth);
  }

  return (
    <Sidebar className="border-r-0 shadow-xl">
      <SidebarHeader className="p-6">
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 px-2 group cursor-pointer"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-1 shadow-md transition-transform group-hover:scale-105">
            {logoImage && (
              <Image
                src={logoImage.imageUrl}
                alt={logoImage.description}
                width={40}
                height={40}
                className="object-contain"
                data-ai-hint={logoImage.imageHint}
              />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg tracking-tight leading-none text-white">
              Cavendish
            </span>
            <span className="font-headline font-semibold text-sm text-secondary leading-none mt-0.5">
              Voices
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn(
                    "h-11 px-4 rounded-xl transition-all duration-200",
                    pathname === item.href 
                      ? "bg-secondary text-secondary-foreground shadow-lg scale-[1.02]" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                    {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {isAdminVisible && (
          <>
            <SidebarSeparator className="bg-white/10 my-4 mx-4" />
            <SidebarGroup className="animate-in fade-in slide-in-from-top-1 duration-500">
              <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                Management
              </SidebarGroupLabel>
              <SidebarMenu>
                {adminNav.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className={cn(
                        "h-11 px-4 rounded-xl transition-all duration-200",
                        pathname === item.href 
                          ? "bg-secondary text-secondary-foreground shadow-lg scale-[1.02]" 
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                        {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </>
        )}

        <SidebarSeparator className="bg-white/10 my-4 mx-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
            Support
          </SidebarGroupLabel>
          <SidebarMenu>
            {supportNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn(
                    "h-11 px-4 rounded-xl transition-all duration-200",
                    pathname === item.href 
                      ? "bg-secondary text-secondary-foreground shadow-lg scale-[1.02]" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        {!isUserLoading && (
          user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <Avatar className="h-8 w-8 border-2 border-secondary shadow-sm">
                  <AvatarImage src={user.photoURL || undefined} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-bold text-xs uppercase">
                    {user.displayName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white truncate">{user.displayName}</span>
                  <span className="text-[10px] text-white/50 truncate">{user.email}</span>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="ml-auto text-white/40 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleSignIn}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-secondary text-secondary-foreground font-bold text-sm hover:scale-[1.02] transition-all shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              Sign in with University Google
            </button>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
