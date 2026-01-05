"use client";

import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCompanyLoggedIn, setIsCompanyLoggedIn] = useState(false);

  const pathname = usePathname();

  /* ---------------------------
   * Load login states
   * --------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("companyUser");

    setIsLoggedIn(!!storedUser && JSON.parse(storedUser)?.loggedIn);
    setIsCompanyLoggedIn(
      !!storedCompany && JSON.parse(storedCompany)?.companyLoggedIn
    );
  }, []);

  /* ---------------------------
   * Close mobile menu on route change
   * --------------------------- */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* ---------------------------
   * Prevent background scroll
   * --------------------------- */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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
    { name: "Browse", href: "/browse" },
    { name: "Companies", href: "/companies" },
    { name: "Bookmarks", href: "/bookmarks" },
    { name: "Assessments", href: "/assessments" },
    { name: "Success Stories", hash: "testimonials" },
    { name: "Plans", hash: "pricing" },
  ];

  const renderLink = (link: typeof LINKS[number], mobile = false) => {
    const baseClasses = mobile
      ? "w-full rounded-lg px-4 py-3 text-base font-medium text-left text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition"
      : "relative px-4 py-2 text-foreground/80 hover:text-foreground transition";

    if (link.href) {
      return (
        <Link
          key={link.name}
          href={link.href}
          className={baseClasses}
          onClick={() => setIsOpen(false)}
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

  /* ---------------------------
   * CTA logic
   * --------------------------- */
  const renderCTA = (mobile = false) => {
    const wrapperClass = mobile ? "w-full flex flex-col gap-3" : "flex items-center gap-3";

    if (pathname === "/browse") {
      if (isCompanyLoggedIn) {
        return (
          <div className={wrapperClass}>
            <Link href="/company/dashboard" className="w-full">
              <Button className="w-full flex items-center gap-2 glassmorphic-button-primary">
                <User className="w-4 h-4" />
                Company Dashboard
              </Button>
            </Link>
          </div>
        );
      }

      if (isLoggedIn) {
        return (
          <div className={wrapperClass}>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full flex items-center gap-2 glassmorphic-button-primary">
                <User className="w-4 h-4" />
                Student Dashboard
              </Button>
            </Link>
          </div>
        );
      }
    }

    return (
      <div className={wrapperClass}>
        <Link href="/company/login" className="w-full">
          <Button className="w-full" variant="outline">
            Company Login
          </Button>
        </Link>

        <Link href="/login" className="w-full">
          <Button className="w-full" variant="outline">
            Student Login
          </Button>
        </Link>

        <Link href="/signup" className="w-full">
          <Button className="w-full glassmorphic-button-primary">
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-foreground/10"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 z-40 glassmorphic border-t px-4 py-6 space-y-4 bg-background">
          <div className="flex flex-col space-y-2">
            {LINKS.map((l) => renderLink(l, true))}
          </div>
          
          <div className="pt-4">
            {renderCTA(true)}
          </div>
          
          <div className="pt-4 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
