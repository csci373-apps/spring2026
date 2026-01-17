"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { getCourseConfig } from "@/lib/config";

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDark = useDarkMode();
  const [isToggleHovered, setIsToggleHovered] = useState(false);
  const courseConfig = getCourseConfig();
  
  const normalizePath = (path: string) => path.replace(/\/$/, "");

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/", label: "Schedule" },
    { href: "/syllabus", label: "Syllabus" },
    { href: "/assignments", label: "Assignments" },
    // { href: "/activities", label: "Activities" },
    { href: "/resources", label: "Resources" },
    { href: "/quizzes", label: "Quizzes" },
  ];

  // Only run on client side to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll for frosted glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav 
      data-nav="true"
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md backdrop-saturate-150 dark:bg-black/80' 
          : 'bg-white dark:bg-black'
      } border-gray-200 dark:border-gray-800`} 
      suppressHydrationWarning
    >
      <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-black dark:text-white font-medium text-lg hover:opacity-80 transition-opacity !no-underline !border-0"
            style={isDark ? { color: '#f9fafb' } : undefined}
            suppressHydrationWarning
          >
            {courseConfig.courseNumber}: {courseConfig.semester}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.slice(1).map((item) => {
            const isActive = mounted && normalizePath(pathname) === normalizePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors !no-underline !border-0 ${
                  isActive
                    ? "text-gray-500 dark:!text-gray-300 font-bold"
                    : "text-gray-500 dark:!text-gray-100 hover:!text-gray-400 dark:hover:!text-white"
                }`}
                style={isDark ? (isActive ? { color: '#d1d5db' } : { color: '#f3f4f6' }) : (isActive ? { color: '#6b7280' } : { color: '#6b7280' })}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            );
          })}
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              // Sun icon for light mode
              <svg
                className="w-5 h-5 text-black dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={isDark ? (isToggleHovered ? { color: '#1f2937' } : { color: '#f3f4f6' }) : undefined}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                className="w-5 h-5 text-black dark:text-white transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu button and dark mode toggle */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            onMouseEnter={() => setIsToggleHovered(true)}
            onMouseLeave={() => setIsToggleHovered(false)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              // Sun icon for light mode
              <svg
                className="w-5 h-5 text-black dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={isDark ? (isToggleHovered ? { color: '#1f2937' } : { color: '#f3f4f6' }) : undefined}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              // Moon icon for dark mode
              <svg
                className="w-5 h-5 text-black dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={isDark ? (isToggleHovered ? { color: '#1f2937' } : { color: '#f3f4f6' }) : undefined}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
          
          <button
            onClick={toggleMenu}
            className="focus:outline-none text-gray-900 dark:text-gray-100"
            style={isDark ? { color: '#f3f4f6' } : undefined}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={isDark ? { color: '#f3f4f6' } : undefined}
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div 
          className={`border-t transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/80 backdrop-blur-md backdrop-saturate-150 dark:bg-black/80' 
              : 'bg-white dark:bg-black'
          } border-gray-200 dark:border-gray-800`}
        >
          {navItems.slice(1).map((item) => {
            const isActive = mounted && normalizePath(pathname) === normalizePath(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`block px-6 py-4 text-sm hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors !no-underline !border-0 ${
                  isActive
                    ? "text-gray-500 dark:!text-gray-300 font-bold bg-gray-50 dark:bg-gray-900"
                    : "text-gray-500 dark:!text-gray-100 hover:!text-gray-400 dark:hover:!text-white"
                }`}
                style={isDark ? (isActive ? { color: '#d1d5db', backgroundColor: '#111827' } : { color: '#f3f4f6' }) : (isActive ? { color: '#6b7280' } : { color: '#6b7280' })}
                suppressHydrationWarning
              >
                {item.label}
              </Link>
            );
          })}
          
          
        </div>
      </div>
    </nav>
  );
}
