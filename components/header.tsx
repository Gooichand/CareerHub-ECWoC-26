"use client";

import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle section scrolling
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
    { name: "Browse", href: "/browse" },
    { name: "Companies", href: "/companies" },
    { name: "Bookmarks", href: "/bookmarks" },
    { name: "Assessments", href: "/assessments" },
    { name: "Success Stories", hash: "testimonials" },
    { name: "Plans", hash: "pricing" },
  ];

  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const baseClasses = mobile
      ? "block w-full rounded-lg px-4 py-3 text-base font-medium text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-colors duration-200"
      : "relative px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-200";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => mobile && setIsOpen(false)}
        >
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
        {link.name}
      </button>
    );
  };

  const renderCTA = (mobile = false) => {
    const wrapperClass = mobile 
      ? "flex flex-col gap-3 w-full" 
      : "flex items-center gap-2";

    return (
      <div className={wrapperClass}>
        <Link href="/company/login" className={mobile ? "w-full" : ""}>
          <Button 
            className={mobile ? "w-full" : ""} 
            variant="outline"
            size={mobile ? "default" : "sm"}
          >
            Company Login
          </Button>
        </Link>

        <Link href="/login" className={mobile ? "w-full" : ""}>
          <Button 
            className={mobile ? "w-full" : ""} 
            variant="outline"
            size={mobile ? "default" : "sm"}
          >
            Student Login
          </Button>
        </Link>

        <Link href="/signup" className={mobile ? "w-full" : ""}>
          <Button 
            className={`${mobile ? "w-full" : ""} glassmorphic-button-primary`}
            size={mobile ? "default" : "sm"}
          >
            Sign Up
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              C
            </div>
            <span className="hidden font-bold sm:inline-block">CareerHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {LINKS.map((link) => renderLink(link))}
          </nav>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            {renderCTA()}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground/60 hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-full max-w-sm bg-background/95 backdrop-blur-xl border-l border-border/40 shadow-lg">
            <div className="flex h-full flex-col">
              {/* Navigation Links */}
              <div className="flex-1 space-y-1 px-4 py-6">
                {LINKS.map((link) => renderLink(link, true))}
              </div>
              
              {/* CTA Buttons */}
              <div className="border-t border-border/40 px-4 py-6">
                {renderCTA(true)}
              </div>
              
              {/* Theme Toggle */}
              <div className="border-t border-border/40 px-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
