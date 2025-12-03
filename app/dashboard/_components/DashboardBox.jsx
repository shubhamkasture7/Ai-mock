"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Home,
  Briefcase,
  User,
  Video,
  CheckSquare,
  MessageCircle,
  Crown,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  // { path: "/jobs", label: "Browse Jobs", icon: Briefcase },
  { path: "/profile", label: "Profile", icon: User },
  {
    path: "/dashboard/mock-interviews",
    label: "Mock Interviews",
    icon: Video,
    badge: "New",
  },
  { path: "/skills", label: "Skills Tests", icon: CheckSquare },
  {
    path: "/dashboard/messages",
    label: "Messages",
    icon: MessageCircle,
    badgeCount: 3,
  },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

 return (
  <>
    {/* Mobile Toggle Button */}
    <button
      className="sm:hidden fixed top-4 right-4 z-50 bg-transparent text-white p-2 rounded-md"
      onClick={() => setOpen(!open)}
    >
      {open ? <X size={22} /> : <Menu size={22} />}
    </button>

    {/* 🔹 Backdrop Overlay */}
    {open && (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
        onClick={() => setOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`h-screen w-64 bg-[#0A1730] text-white flex flex-col justify-between fixed z-40 transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"} 
      sm:translate-x-0`}
    >
      {/* Top Section */}
      <div>
        <div className="p-6 font-bold text-lg">JobPortal</div>

        <ul className="mt-4 space-y-1">
          {sidebarItems.map(({ path: navPath, label, icon: Icon, badge, badgeCount }) => {
            const active = path.startsWith(navPath);
            return (
              <li key={navPath}>
                <Link
                  href={navPath}
                  onClick={() => setOpen(false)} // 💥 Auto close after navigation
                  passHref
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
            onClick={() => setOpen(false)} // close after clicking
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
