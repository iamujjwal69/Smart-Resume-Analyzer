import type { Metadata } from "next";
import { ClerkProvider, SignInButton, Show, UserButton } from '@clerk/nextjs'
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { Briefcase } from "lucide-react";
import { Toaster } from "sonner";
import Link from "next/link";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerOS | Premium ATS Resume Analyzer & Career Hub",
  description: "Accelerate your career with AI-powered ATS resume matching, interview prep, cover letter generation, and learning roadmaps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all">
            <div className="max-w-[1600px] mx-auto flex h-16 items-center justify-between px-6 md:px-8">
              <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-lg shadow-primary/15">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Career<span className="font-extrabold text-primary">OS</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  AI Beta
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/95 transition-all shadow-sm">
                      Sign In
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard/upload"
                      className="hidden sm:inline-flex items-center justify-center text-xs font-semibold bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-lg hover:bg-primary/15 transition-all"
                    >
                      New Analysis ✨
                    </Link>
                    <UserButton />
                  </div>
                </Show>
              </div>
            </div>
          </header>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

