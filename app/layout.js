// app/layout.js (RootLayout)
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/app/dashboard/_components/DashboardBox"; // sidebar
import Image from "next/image";
// import logo from "@/public/logo.jpg";
import { Analytics } from "@vercel/analytics/next"


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL("https://nextgenmock.vercel.app/"), // change later
  title: {
    default: "Next Gen Hire",
    template: "%s | Next Gen Hire",
  },
  description:
    "Next Gen Hire helps job seekers crack interviews with AI-powered mock interviews, resume feedback, and smart career tools.",
  // ... other metadata (keywords, openGraph, twitter, robots, etc.)

  icons: {
    icon: [
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/icon-light.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};


export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex min-h-screen bg-slate-950 text-slate-50">
            {/* Fixed, responsive sidebar */}
            <Sidebar />

            {/* Main content: full width on mobile, shifted right on desktop */}
            <div className="flex-1 sm:ml-64 ml-0">
              {/* Top bar with logo for mobile (since sidebar already has space on desktop) */}
              <header className="sm:hidden flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
                <Image
                  src="/logo.svg"
                  alt="Next Gen Hire logo"
                  width={32}
                  height={32}
                  priority
                />
                <span className="font-semibold tracking-tight">
                  Next Gen Hire
                </span>
              </header>
              {children}
        <Analytics />

              <Toaster />
              <main>{children}</main>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
