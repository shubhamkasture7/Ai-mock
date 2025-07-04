"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css"; // Keep for custom overrides if needed

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/questiones", label: "Questions" },
    { path: "/dashboard/upgrade", label: "Upgrade" },
    { path: "/dashboard/how", label: "How it works?" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false); // Close on click
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.svg"
            width={150}
            height={50}
            alt="Logo"
            className="cursor-pointer"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8">
          {navItems.map(({ path: navPath, label }) => (
            <Link key={navPath} href={navPath} passHref>
              <span
                className={`cursor-pointer font-medium transition-all duration-300 hover:text-yellow-300 ${
                  path.startsWith(navPath)
                    ? "underline underline-offset-4 text-yellow-300 font-semibold"
                    : "text-white"
                }`}
              >
                {label}
              </span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="ml-4">
          <UserButton afterSignOutUrl="/" />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 shadow-lg rounded-b-xl px-6 py-4 animate-slideDown">
          <ul className="space-y-4">
            {navItems.map(({ path: navPath, label }) => (
              <li key={navPath} onClick={handleNavClick}>
                <Link href={navPath} passHref>
                  <span
                    className={`block font-medium text-lg transition-all duration-200 ${
                      path.startsWith(navPath)
                        ? "text-indigo-600 underline underline-offset-4"
                        : "hover:text-purple-600"
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;
