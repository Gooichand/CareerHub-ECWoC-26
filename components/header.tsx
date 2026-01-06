"use client";

import { useState, useEffect } from "react";
import { Menu, User, Briefcase, Building2, Bookmark, GraduationCap, Award, CreditCard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  /* ---------------------------
   * Close mobile menu on route change
   * --------------------------- */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* ---------------------------
   * Smooth scroll
   * --------------------------- */
  const handleSectionClick = (hash: string) => {
    if (window.location.pathname === "/") {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${hash}`;
    }
    setIsOpen(false);
  };

  const LINKS = [
    { name: "Browse", href: "/browse", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
    { name: "Assessments", href: "/assessments", icon: GraduationCap },
    { name: "Success Stories", hash: "testimonials", icon: Award },
    { name: "Plans", hash: "pricing", icon: CreditCard },
  ];

  const isAuthenticated = status === "authenticated";

  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const Icon = link.icon;
    const baseClasses = mobile
      ? "group w-full rounded-xl px-4 py-3.5 text-base font-medium text-left flex items-center gap-3 text-foreground/70 hover:text-foreground hover:bg-primary/10 transition-all duration-200"
      : "relative px-4 py-2 text-foreground/80 hover:text-foreground transition";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => setIsOpen(false)}
        >
          {mobile && Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          {link.name}
        </Link>
      );
    }

    return (
      <button
        key={link.name}
        className={baseClasses}
        onClick={() => handleSectionClick(link.hash!)}
      >
        {mobile && Icon && <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
        {link.name}
      </button>
    );
  };

  /* ---------------------------
   * CTA logic
   * --------------------------- */
  const renderCTA = (mobile = false) => {
    const wrapperClass = mobile ? "w-full flex flex-col gap-2.5" : "flex items-center gap-3";

    if (isAuthenticated) {
      return (
        <div className={wrapperClass}>
          <Link href="/dashboard" className="w-full">
            <Button className="w-full flex items-center justify-center gap-2 glassmorphic-button-primary shadow-lg hover:shadow-xl transition-all">
              <Sparkles className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className={wrapperClass}>
        <Link href="/company/login" className="w-full">
          <Button className="w-full justify-center" variant="outline">
            <Building2 className="w-4 h-4 mr-2" />
            Company Login
          </Button>
        </Link>

        <Link href="/login" className="w-full">
          <Button className="w-full justify-center" variant="outline">
            <User className="w-4 h-4 mr-2" />
            Student Login
          </Button>
        </Link>

        <Link href="/signup" className="w-full">
          <Button className="w-full justify-center glassmorphic-button-primary shadow-lg hover:shadow-xl transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 h-16 glassmorphic border-b">
      <nav className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-foreground/20 flex items-center justify-center font-bold">
            C
          </div>
          <span className="font-bold hidden sm:block">CareerHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2">
          {LINKS.map((l) => renderLink(l))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {renderCTA()}
        </div>

        {/* Mobile Toggle */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg hover:bg-foreground/10"
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[400px] flex flex-col">
            <SheetHeader className="text-left space-y-3 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center font-bold text-primary-foreground shadow-lg">
                  C
                </div>
                <div>
                  <SheetTitle className="text-xl font-bold">CareerHub</SheetTitle>
                  <p className="text-xs text-muted-foreground">Your career companion</p>
                </div>
              </div>
            </SheetHeader>

            <Separator className="my-2" />

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 py-4">
                <div className="space-y-1">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {LINKS.map((l) => renderLink(l, true))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 px-2">
                  <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                  {renderCTA(true)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t mt-auto">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
