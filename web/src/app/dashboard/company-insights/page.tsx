"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, Building2, MapPin, Users, Calendar, Heart, Code2, Presentation, BookmarkPlus, ArrowUpRight } from "lucide-react";

export default function CompanyInsightsPage() {
  const [companyName, setCompanyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<any>(null);

  const fetchInsights = async () => {
    if (!companyName) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/company/insights/fetch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      const data = await response.json();
      if (!data.error) {
        setInsights(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const safeParseJSON = (str: any) => {
    try {
      return typeof str === 'string' ? JSON.parse(str) : str;
    } catch {
      return [];
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Company Insights</h1>
          <p className="text-muted-foreground">
            Research companies, understand their tech stack, culture, and interview processes.
          </p>
        </div>
      </div>

      <Card className="glass-panel">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search for any company (e.g. Google, Stripe, Notion)..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchInsights()}
              className="flex h-12 flex-1 rounded-md border border-input bg-background px-4 py-2 text-md ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <Button size="lg" className="h-12 px-8" onClick={fetchInsights} disabled={!companyName || isGenerating}>
              {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
              {isGenerating ? "Researching..." : "Research"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overview Card */}
            <Card className="border-t-4 border-t-primary shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">{insights.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{insights.industry}</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <BookmarkPlus className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {insights.description || insights.overview}
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  {insights.headquarters && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" /> {insights.headquarters}
                    </div>
                  )}
                  {insights.employeeCount > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" /> {insights.employeeCount.toLocaleString()}+ employees
                    </div>
                  )}
                  {insights.foundedYear > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" /> Founded {insights.foundedYear}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tech Stack */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-500" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {safeParseJSON(insights.techStack).map((tech: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interview Process */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Presentation className="h-5 w-5 text-purple-500" />
                  Interview Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Difficulty Rating</p>
                    <p className="text-2xl font-bold">{insights.interviewDifficulty || 'Medium'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Avg Software Engineer Salary</p>
                    <p className="text-2xl font-bold">₹{(insights.averageSalary || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Topics</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {safeParseJSON(insights.commonInterviewTopics).map((topic: string, i: number) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Culture & Benefits */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Culture & Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-bold text-primary">{insights.cultureScore || '8.0'}</div>
                  <div className="text-sm text-muted-foreground">/ 10<br/>Culture Score</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Core Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {safeParseJSON(insights.culture).map((c: string, i: number) => (
                      <span key={i} className="px-2 py-1 border rounded-md text-xs">{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Top Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {safeParseJSON(insights.benefits).map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-500" />
                  Recent News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {safeParseJSON(insights.recentNews).map((newsItem: string, i: number) => (
                    <a 
                      key={i} 
                      href={`https://www.google.com/search?q=${encodeURIComponent(newsItem + " " + insights.name + " news")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block cursor-pointer"
                    >
                      <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                        {newsItem}
                      </p>
                      <div className="flex items-center text-xs text-primary mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        Read more <ArrowUpRight className="h-3 w-3 ml-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      )}
    </div>
  );
}
