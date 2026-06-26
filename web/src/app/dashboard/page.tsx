import Link from "next/link";
import { 
  UploadCloud, 
  Sparkles, 
  PenTool, 
  Mic, 
  Map, 
  KanbanSquare, 
  Building2, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  CalendarCheck
} from "lucide-react";

export default function DashboardPage() {
  const tools = [
    {
      title: "ATS Resume Scan",
      description: "Upload your resume and a target job description to get an instant ATS compatibility score and key recommendations.",
      icon: UploadCloud,
      href: "/dashboard/upload",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/20",
      cta: "Run Scan"
    },
    {
      title: "AI Resume Tailor",
      description: "Optimize your resume bullet points for a job description without introducing untruthful or exaggerated statements.",
      icon: Sparkles,
      href: "/dashboard/tailor",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/20",
      cta: "Tailor Bullets"
    },
    {
      title: "Cover Letter Creator",
      description: "Generate highly tailored, professional cover letters that highlight your matches with the role's primary requirements.",
      icon: PenTool,
      href: "/dashboard/cover-letter",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/20",
      cta: "Create Letter"
    },
    {
      title: "Mock Interview Prep",
      description: "Conduct real-time, interactive audio-based practice interviews with tailored behavioral and technical questions.",
      icon: Mic,
      href: "/dashboard/interview",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/20",
      cta: "Start Practice"
    },
    {
      title: "Learning Roadmaps",
      description: "Bridge critical skill gaps by auto-generating structured learning timelines and pathways to reach your target role.",
      icon: Map,
      href: "/dashboard/roadmap",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/20",
      cta: "Build Path"
    },
    {
      title: "Company Insights Hub",
      description: "Research any target company's technologies, internal cultural values, interview processes, and typical salaries.",
      icon: Building2,
      href: "/dashboard/company-insights",
      color: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900/20",
      cta: "Search Insights"
    }
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner with Background Image */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-cover bg-center p-6 md:p-8 shadow-md"
        style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('/dashboard_banner.png')" }}
      >
        <div className="relative max-w-2xl space-y-2 text-white">
          <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm border border-white/10 select-none">
            Member Workspace
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-white">
            Welcome to CareerOS Workspace
          </h1>
          <p className="text-sm md:text-base text-slate-100/90 leading-relaxed font-medium">
            Launch tools to scan and tailor resumes, draft matching cover letters, track active interview pipeline stages, and research company profiles.
          </p>
        </div>
      </div>

      {/* Stats Summary Grid with Visual SVG Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Metric 1 */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ATS Readiness</span>
            </div>
            <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold">85%</span>
            <span className="text-xs text-muted-foreground">Match Rating</span>
          </div>
          {/* Sparkline chart */}
          <div className="w-full h-8 pt-2">
            <svg className="w-full h-full text-blue-500" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path 
                d="M0,18 Q15,10 30,12 T60,5 T90,8 T100,2" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interview Pipeline</span>
            </div>
            <span className="text-[10px] text-purple-500 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full">3 Active</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold">4</span>
            <span className="text-xs text-muted-foreground">Applications Scheduled</span>
          </div>
          {/* Funnel Progress Indicator */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
            <div className="bg-purple-500 h-full rounded-full w-3/4" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Salary Growth</span>
            </div>
            <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">Optimal</span>
          </div>
          <div className="flex items-baseline gap-2 mt-4">
            <span className="text-3xl font-extrabold">+24%</span>
            <span className="text-xs text-muted-foreground">Avg Offer Bump</span>
          </div>
          {/* Bar Chart Sparkline */}
          <div className="flex gap-1.5 items-end h-8 pt-2">
            <div className="bg-green-500/20 w-full h-2 rounded-t" />
            <div className="bg-green-500/40 w-full h-4 rounded-t" />
            <div className="bg-green-500/50 w-full h-3 rounded-t" />
            <div className="bg-green-500/70 w-full h-6 rounded-t" />
            <div className="bg-green-500 w-full h-8 rounded-t" />
          </div>
        </div>

      </div>

      {/* Main Suite / Tools Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Action Hub</h2>
          <p className="text-sm text-muted-foreground mt-1">Select an optimization tool to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div 
                key={idx} 
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-6 glow-card transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${tool.color} shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <Link 
                    href={tool.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200"
                  >
                    {tool.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
