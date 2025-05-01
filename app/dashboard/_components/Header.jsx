"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Header.css"; // Keep your own styles if needed

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    console.log("Current path:", path);
  }, [path]);

  if (!hasMounted) return null;

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/questiones", label: "Questiones" },
    { path: "/dashboard/upgrade", label: "Upgrade" },
    { path: "/dashboard/how", label: "How it works?" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false); // Auto-close mobile menu
  };

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm relative z-50">
      <Image src={"/logo.svg"} width={160} height={100} alt="logo" />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-8">
        {navItems.map(({ path: navPath, label }) => (
          <li key={navPath}>
            <Link href={navPath} passHref>
              <span
                className={`transition-all duration-200 cursor-pointer hover:text-blue-500 ${
                  path.startsWith(navPath)
                    ? "text-blue-600 font-semibold underline underline-offset-4"
                    : "text-gray-700"
                }`}
              >
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Toggle */}
      <button className="md:hidden text-2xl" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 bg-white shadow-md p-4 rounded-xl animate-slideDown">
          <ul>
            {navItems.map(({ path: navPath, label }) => (
              <li key={navPath} className="py-2" onClick={handleNavClick}>
                <Link href={navPath} passHref>
                  <span
                    className={`transition-colors duration-200 cursor-pointer block ${
                      path.startsWith(navPath)
                        ? "text-blue-600 font-semibold underline underline-offset-4"
                        : "text-gray-700"
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

      {/* User Avatar */}
      <div className="ml-4">
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
