"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertCircle, AlertTriangle, ArrowLeft, FileText, CheckCircle, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const id = searchParams.get("id");

    async function loadData() {
      if (id) {
        const res = await fetch("/api/scans");
        if (res.ok) {
          const scans = await res.json();
          const scan = scans.find((s: any) => s.id === id);
          if (scan) {
            setData({
              ...scan,
              ats_score: scan.atsScore,
              missing_keywords: JSON.parse(scan.missingKeywords),
              weak_bullets: JSON.parse(scan.weakBullets),
              suggestions: JSON.parse(scan.suggestions),
            });
            return;
          }
        }
      }

      const resultStr = sessionStorage.getItem("analysisResult");
      if (resultStr) {
        setData(JSON.parse(resultStr));
      } else {
        router.push("/dashboard/upload");
      }
    }

    loadData();
  }, [router, searchParams]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 animate-pulse">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading match report...</p>
      </div>
    );
  }

  const isHighReady = data.ats_score >= 80;
  const isMediumReady = data.ats_score >= 60 && data.ats_score < 80;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">ATS Analysis Report</h1>
          <p className="text-muted-foreground">Detailed evaluation of how your resume aligns with requirements</p>
        </div>
        <Link href="/dashboard/upload">
          <Button variant="outline" className="rounded-xl font-semibold shadow-sm text-xs">
            <ArrowLeft className="h-4 w-4 mr-2" /> Scan Another Resume
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ATS Score Gauge Card */}
        <Card className="glass-panel border-border/70 shadow-lg lg:col-span-1 overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">ATS Alignment</CardTitle>
            <CardDescription>Overall resume compatibility</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              {/* Radial Score Gauge */}
              <svg className="w-44 h-44 transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-muted/30"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="74"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="465"
                  strokeDashoffset={465 - (465 * data.ats_score) / 100}
                  className={`transition-all duration-1000 ease-out ${
                    isHighReady 
                      ? 'text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                      : isMediumReady 
                      ? 'text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                      : 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-4xl font-extrabold tracking-tight">{data.ats_score}</span>
                <span className="text-muted-foreground text-xs uppercase font-bold tracking-wider mt-0.5">Score</span>
              </div>
            </div>

            <div className="mt-8 text-center space-y-2 px-2">
              <h4 className="font-bold text-md flex items-center justify-center gap-1.5">
                {isHighReady ? (
                  <>
                    <Trophy className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 dark:text-green-400">Excellent Fit!</span>
                  </>
                ) : isMediumReady ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-600 dark:text-amber-400">Good, Needs Tweaks</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                    <span className="text-rose-600 dark:text-rose-400">High Risk of Filter</span>
                  </>
                )}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isHighReady 
                  ? "Your resume strongly matches the criteria and has a very high chance of passing ATS screeners."
                  : isMediumReady 
                  ? "You have a solid baseline. Integrate the missing keywords below to cross the target score of 80+."
                  : "Crucial skills are missing. Revise your experience sections to explicitly mirror the job description requirements."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Missing Keywords Card */}
        <Card className="border-border/70 shadow-lg lg:col-span-2 overflow-hidden flex flex-col justify-between">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/10">
                <AlertTriangle className="h-4.5 w-4.5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Missing Keywords</CardTitle>
                <CardDescription>Add these terms to boost visibility</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We parsed the job description requirements and identified these critical terms that were not found in your resume. Insert them naturally into your descriptions to trigger matching logic.
            </p>
            {data.missing_keywords && data.missing_keywords.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {data.missing_keywords.map((keyword: string, idx: number) => (
                  <Badge 
                    key={idx}
                    variant="outline" 
                    className="px-3 py-1.5 bg-rose-50/40 hover:bg-rose-50 dark:bg-rose-950/10 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30 text-xs font-semibold rounded-full select-none"
                  >
                    + {keyword}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-green-600 text-sm">
                <CheckCircle className="h-4 w-4" /> All core keywords identified in target description match!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Improvement Suggestions Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">AI Section Recommendations</h2>
          <p className="text-sm text-muted-foreground mt-1">Actionable edits formulated to strengthen your profile</p>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {data.suggestions && data.suggestions.map((sugg: any, idx: number) => (
            <Card key={idx} className="overflow-hidden border border-border/70 shadow-sm hover:border-primary/30 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b md:border-b-0 border-border/40">
                {/* Left Area: Section Tag */}
                <div className="p-5 flex flex-col justify-center items-start md:items-center bg-muted/20 md:col-span-1 select-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-muted-foreground/15 text-muted-foreground border border-muted-foreground/10">
                    {sugg.section}
                  </span>
                </div>
                {/* Right Area: Issue vs Fix Details */}
                <div className="p-5 md:col-span-3 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">Issue Found</h4>
                    <p className="text-sm leading-relaxed text-foreground/80">{sugg.issue}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-500/5 dark:bg-green-950/10 border border-green-500/10 dark:border-green-900/20">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Proposed Optimization</h4>
                    <p className="text-sm leading-relaxed text-green-950 dark:text-green-300">{sugg.fix}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading report...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

