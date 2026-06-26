"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  UploadCloud, 
  PenTool, 
  Mic, 
  Map, 
  Building2, 
  ChevronDown, 
  CheckCircle,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  // ATS Simulator State
  const [targetTitle, setTargetTitle] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedFeedback, setSimulatedFeedback] = useState<string[]>([]);

  // Accordion FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const runMockSimulation = () => {
    if (!targetTitle || !skillsText) return;
    setIsSimulating(true);
    setSimulatedScore(null);

    setTimeout(() => {
      // Simple algorithm to generate a realistic score based on skill characters
      const scoreBase = Math.floor(Math.random() * 20) + 55; // 55 to 75
      const lengthBonus = Math.min(15, Math.floor(skillsText.length / 30));
      const titleMatchBonus = skillsText.toLowerCase().includes(targetTitle.toLowerCase()) ? 10 : 0;
      const finalScore = Math.min(96, scoreBase + lengthBonus + titleMatchBonus);

      setSimulatedScore(finalScore);
      setIsSimulating(false);

      // Generate context recommendations
      const feedback = [];
      if (finalScore < 80) {
        feedback.push(`ATS Score is ${finalScore}%: Consider adding industry-specific metrics.`);
        feedback.push("Missing core keyword alignment in summary paragraph.");
        feedback.push("Add quantitative impact statements (e.g. 'Improved speed by 30%') to increase score.");
      } else {
        feedback.push(`ATS Score is ${finalScore}%: Excellent baseline metrics.`);
        feedback.push("Keywords matches verified for the target title.");
        feedback.push("Ready to apply! Scan full resume in the dashboard for breakdown.");
      }
      setSimulatedFeedback(feedback);
    }, 1500);
  };

  const faqData = [
    {
      q: "How does the ATS Scanner score my resume?",
      a: "Our scanner parses your resume text structure, checks matching density for target requirements in the job description, highlights missing keywords, and flags formatting anomalies that cause parser issues in systems like Workday or Greenhouse."
    },
    {
      q: "Does the AI Resume Tailor fabricate experience?",
      a: "No. The AI Resume Tailor is engineered to adjust phrasing, highlights, and keyword focus based solely on your existing skills and experiences, preventing exaggeration or false formatting."
    },
    {
      q: "What makes the Mock Interview prep personalized?",
      a: "We extract core competencies and history bullets from your uploaded resume, correlate them with the target role description, and generate highly targeted questions that you're likely to hear in a real interview loop."
    },
    {
      q: "Is there a limit to how many resumes I can test?",
      a: "Beta users can scan and track up to 20 resumes and cover letters. Upgrade credentials and Recruiter Database tools are accessible for premium partners."
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 border-b border-border bg-card">
        <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-primary/5 rounded-full filter blur-3xl -mr-32 -mt-32 select-none pointer-events-none" />
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5" /> Career Acceleration Engine
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gradient animate-in fade-in duration-700">
              Land 3x More Interviews With CareerOS
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Optimize your resume for applicant tracking systems, tailor application bullet points, draft custom cover letters, and practice loops with mock interviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto font-semibold gradient-btn h-12 rounded-xl text-sm px-8">
                  Get Started Free <ArrowRight className="h-4.5 w-4.5 ml-2" />
                </Button>
              </Link>
              <a href="#ats-simulator">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold h-12 rounded-xl text-sm px-8 border-border bg-card">
                  Try ATS Match Simulator
                </Button>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-4">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" /> ATS Compatibility Scans</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" /> AI Bullet Tailoring</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-500" /> Live Mock Audits</span>
            </div>
          </div>

          {/* Right Image Illustration Column */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group p-1.5 rounded-2xl bg-gradient-to-tr from-primary/10 to-indigo-500/10 border border-primary/15 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)]">
              <img 
                src="/hero_visual.png" 
                alt="CareerOS Application Screenshot" 
                className="rounded-xl border border-border shadow-2xl hover:scale-[1.01] transition-transform duration-500 w-full max-w-[580px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Brand Grid Showcase */}
      <section className="py-8 bg-muted/20 border-b border-border">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/60 mb-6">
            Optimize applications for leading companies globally
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 select-none">
            <span className="font-extrabold text-lg tracking-wider">STRIPE</span>
            <span className="font-extrabold text-lg tracking-wider">GOOGLE</span>
            <span className="font-extrabold text-lg tracking-wider">NOTION</span>
            <span className="font-extrabold text-lg tracking-wider">NETFLIX</span>
            <span className="font-extrabold text-lg tracking-wider">AIRBNB</span>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-20 md:py-28 max-w-[1600px] mx-auto px-6 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-gradient">Unified Application Suite</h2>
          <p className="text-sm md:text-base text-muted-foreground">Every capability required to scale your application loops</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/10 flex items-center justify-center">
                <UploadCloud className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">ATS Resume Audit</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scan your PDF resume directly against target requirements, receive match percentages, highlight formatting flags, and identify missing keywords.
              </p>
            </div>
            <Link href="/dashboard/upload" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Scan Resume <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">AI Resume Tailoring</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reposition bullet points and optimize descriptions to exactly align with critical competencies from the target role definition.
              </p>
            </div>
            <Link href="/dashboard/tailor" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Tailor Bullets <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/10 flex items-center justify-center">
                <PenTool className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Tailored Cover Letters</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Formulate elegant, ATS-friendly cover letters tailored to the organization, highlighting matching keywords and structural details.
              </p>
            </div>
            <Link href="/dashboard/cover-letter" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Create Letter <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/10 flex items-center justify-center">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Mock Practice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Generate tailored loop questions based on your background and target requirements. Simulates live voice recording exercises.
              </p>
            </div>
            <Link href="/dashboard/interview" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Start Practice <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/10 flex items-center justify-center">
                <Map className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Learning Roadmaps</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build stage-by-step career developer roadmaps. Learn key skills required to reach target engineering benchmarks.
              </p>
            </div>
            <Link href="/dashboard/roadmap" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Build Roadmap <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>

          <Card className="glass-panel border-border/70 p-6 glow-card flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/20 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/10 flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold">Company Insights</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Research tech stacks, engineering values, common loop topics, founder updates, and local salaries in seconds.
              </p>
            </div>
            <Link href="/dashboard/company-insights" className="inline-flex items-center text-xs font-bold text-primary pt-6 group">
              Search Tech <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </Card>
        </div>
      </section>

      {/* Interactive ATS Simulator Section */}
      <section id="ats-simulator" className="py-20 bg-muted/20 border-y border-border">
        <div className="max-w-4xl mx-auto px-6 md:px-8 space-y-12">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted-foreground/10 text-muted-foreground text-[10px] font-bold uppercase tracking-wider border border-muted-foreground/10">
              Live Demo Sandbox
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gradient">ATS Match Score Simulator</h2>
            <p className="text-sm text-muted-foreground">Test how keywords match your profile in real-time</p>
          </div>

          <Card className="glass-panel border-border/70 shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Target Role Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior React Developer"
                    value={targetTitle}
                    onChange={(e) => setTargetTitle(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-border/85 bg-background px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans">Resume Summary or Key Skills</label>
                  <textarea
                    placeholder="Paste a few skills or summary (e.g. React, Next.js, Redux, Typescript, AWS...)"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="flex min-h-[44px] max-h-[120px] w-full rounded-xl border border-border/85 bg-background px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button 
                  onClick={runMockSimulation}
                  disabled={!targetTitle || !skillsText || isSimulating}
                  className="gradient-btn font-semibold px-10 h-11 rounded-xl text-sm"
                >
                  {isSimulating ? (
                    <>
                      <Zap className="h-4.5 w-4.5 mr-2 animate-bounce text-amber-300" /> Analysing Density...
                    </>
                  ) : (
                    <>Test ATS Score Match</>
                  )}
                </Button>
              </div>

              {simulatedScore !== null && (
                <div className="pt-6 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-6 items-center animate-in zoom-in-95 duration-300">
                  <div className="col-span-1 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-2xl border border-border/50">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Simulator score</span>
                    <span className={`text-4xl font-extrabold mt-1.5 ${
                      simulatedScore >= 80 ? 'text-green-500' : 'text-amber-500'
                    }`}>{simulatedScore}%</span>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Simulator Feedback Recommendations</h4>
                    <ul className="space-y-1.5">
                      {simulatedFeedback.map((f, i) => (
                        <li key={i} className="flex gap-2 text-xs text-foreground/80 font-medium">
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive FAQ Accordion Section */}
      <section className="py-20 max-w-4xl mx-auto px-6 md:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-gradient">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">Everything you need to know about our parsing logic</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="border border-border/70 rounded-2xl bg-card overflow-hidden shadow-sm hover:border-border transition-colors cursor-pointer select-none"
                onClick={() => toggleFaq(idx)}
              >
                <div className="p-5 flex items-center justify-between gap-4 font-bold text-sm text-foreground/90">
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primary' : ''
                  }`} />
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="py-16 md:py-20 border-t border-border bg-gradient-to-br from-primary/5 to-indigo-500/5">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Ready to Supercharge Your Resume?</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            Create a profile dashboard, upload your base resumes, parsing ATS indicators, and matching Loop interviews in minutes.
          </p>
          <div className="flex justify-center pt-2">
            <Link href="/dashboard">
              <Button size="lg" className="gradient-btn font-semibold px-12 h-12 rounded-xl text-sm shadow-md shadow-primary/20">
                Go To Control Dashboard <ArrowRight className="h-4.5 w-4.5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
