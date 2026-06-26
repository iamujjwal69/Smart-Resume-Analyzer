"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  History, 
  Sparkles, 
  PenTool, 
  Mic, 
  Map, 
  KanbanSquare, 
  Building2, 
  ShieldAlert, 
  Settings 
} from "lucide-react";

type NavItem = {
  name: string;
  href: string;
  icon: any;
};

type NavGroup = {
  groupName: string;
  items: NavItem[];
};

const NAVIGATION: NavGroup[] = [
  {
    groupName: "Overview",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "History", href: "/dashboard/history", icon: History },
      { name: "Job Tracker", href: "/dashboard/applications", icon: KanbanSquare },
    ]
  },
  {
    groupName: "AI Tool Suite",
    items: [
      { name: "New Analysis", href: "/dashboard/upload", icon: UploadCloud },
      { name: "AI Tailor", href: "/dashboard/tailor", icon: Sparkles },
      { name: "Cover Letter", href: "/dashboard/cover-letter", icon: PenTool },
      { name: "Mock Interview", href: "/dashboard/interview", icon: Mic },
      { name: "Learning Roadmap", href: "/dashboard/roadmap", icon: Map },
      { name: "Company Insights", href: "/dashboard/company-insights", icon: Building2 },
    ]
  },
  {
    groupName: "Management",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-68 border-r border-border bg-card p-5 hidden md:flex flex-col justify-between select-none">
        <div className="space-y-6 overflow-y-auto pr-1">
          {NAVIGATION.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                {group.groupName}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all group duration-200 overflow-hidden ${
                        isActive
                          ? "bg-primary/8 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-0.5"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1.2 rounded-r-full bg-primary" />
                      )}
                      <Icon className={`h-4.5 w-4.5 transition-all duration-200 ${
                        isActive ? "text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Recruiter Portal Callout */}
        <div className="pt-4 border-t border-border">
          <Link
            href="/admin"
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:text-purple-300 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 border border-purple-200/50 dark:border-purple-900/30 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
              <span>Recruiter Portal</span>
            </div>
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
              PRO
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20 dark:bg-background/40">
        <div className="container p-6 md:p-8 max-w-7xl mx-auto page-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

