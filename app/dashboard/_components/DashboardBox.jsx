"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Home,
  User,
  Video,
  CheckSquare,
  MessageCircle,
  Crown,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home, requiresAuth: true },
  { path: "/profile", label: "Profile", icon: User, requiresAuth: true },
  {
    path: "/dashboard/mock-interviews",
    label: "Mock Interviews",
    icon: Video,
    badge: "New",
    requiresAuth: true,
  },
  { path: "/skills", label: "Skills Tests", icon: CheckSquare, requiresAuth: true },
  {
    path: "/messages",
    label: "Messages",
    icon: MessageCircle,
    badgeCount: 3,
    requiresAuth: true,
  },
  // you can add non-auth routes without requiresAuth, e.g.:
  // { path: "/pricing", label: "Pricing", icon: Crown, requiresAuth: false },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);

  const handleNavClick = (e, item) => {
    // don’t do anything until Clerk is ready
    if (!isLoaded) return;

    if (item.requiresAuth && !isSignedIn) {
      e.preventDefault();
      setOpen(false);

      // optional: add redirect param so after login we go back
      router.push(`/sign-in?redirect_url=${encodeURIComponent(item.path)}`);
      return;
    }

    // normal navigation
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sm:hidden fixed top-4 right-4 z-50 bg-[#0A1730] text-white p-2 rounded-md shadow-md"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop Overlay (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen w-64 bg-[#0A1730] text-white flex flex-col justify-between
          fixed left-0 top-0 z-40 transition-transform duration-300
          ${open ? "flex" : "hidden sm:flex"}
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        {/* Top Section */}
        <div>
          <div className="p-6 font-bold text-lg">Dashboard</div>

          <ul className="mt-4 space-y-1">
            {sidebarItems.map((item) => {
              const { path: navPath, label, icon: Icon, badge, badgeCount } = item;
              const active = path.startsWith(navPath);

              return (
                <li key={navPath}>
                  <Link
                    href={navPath}
                    passHref
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    <div
                      className={`flex items-center justify-between px-5 py-3 cursor-pointer transition-all duration-300 ${
                        active
                          ? "bg-[#1E293B] text-yellow-300 font-semibold"
                          : "hover:bg-[#1E293B]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </div>

                      {badge && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          {badge}
                        </span>
                      )}
                      {badgeCount && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
                          {badgeCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="p-5 space-y-4">
          <div className="bg-[#1E293B] rounded-lg p-4 text-center">
            <Crown className="mx-auto w-6 h-6 text-yellow-400 mb-2" />
            <p className="text-sm font-medium">Upgrade to Premium</p>
            <p className="text-xs text-gray-400">
              Get unlimited access to all features
            </p>

            <Link
              href="/upgrade"
              className="mt-3 w-full block text-center bg-yellow-400 text-black text-sm font-semibold py-1.5 rounded hover:bg-yellow-500 transition"
              onClick={() => setOpen(false)}
            >
              Upgrade
            </Link>
          </div>

          <div className="flex justify-center pb-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </aside>
    </>
  );
}
