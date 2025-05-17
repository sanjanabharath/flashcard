"use client";

import Link from "next/link";
import { BookOpen, BarChart2, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { 
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/flashcards", label: "My Flashcards", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { href: "/practice", label: "Practice", icon: <Plus className="h-4 w-4 mr-2" /> },
    { href: "/progress", label: "Progress", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 items-center justify-between w-full max-w-7xl px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-orange-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            FlashLearn
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <ul className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-orange-500 ${
                    pathname === link.href
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button className="ml-6 h-8 px-4 bg-orange-500 hover:bg-orange-600">
            Create Flashcard
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center py-2 text-lg font-medium transition-colors hover:text-orange-500 ${
                    pathname === link.href
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
              <Button className="mt-4 h-10 px-4 bg-orange-500 hover:bg-orange-600">
                Create Flashcard
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
