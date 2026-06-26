"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Map } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function RoadmapPage() {
  const [missingSkills, setMissingSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<string[]>([]);

  const generateRoadmap = async () => {
    if (!missingSkills || !targetRole) return;
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("missing_skills", missingSkills);
    formData.append("target_role", targetRole);

    try {
      const response = await fetch("http://localhost:8000/api/roadmap/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success" && data.data.roadmap) {
        setRoadmap(data.data.roadmap);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Learning Roadmap</h1>
        <p className="text-muted-foreground">
          Bridge the gap between your current skills and your target role with a customized learning path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="text-md font-bold">1. Target Role</CardTitle>
            <CardDescription>What job or career path are you aiming for?</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="e.g., Senior Frontend Engineer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border/70 bg-background px-3.5 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="text-md font-bold">2. Missing Skills</CardTitle>
            <CardDescription>Which technologies or tools do you need to learn?</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., React Testing Library, CI/CD, AWS..."
              value={missingSkills}
              onChange={(e) => setMissingSkills(e.target.value)}
              className="min-h-[100px] resize-none border border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={generateRoadmap} 
          disabled={!missingSkills || !targetRole || isGenerating}
          className="w-full md:w-auto px-12 gradient-btn font-semibold rounded-xl text-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Timeline...
            </>
          ) : (
            <>
              <Map className="mr-2 h-5 w-5" />
              Build My Roadmap
            </>
          )}
        </Button>
      </div>

      {roadmap.length > 0 && (
        <div className="mt-12 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Your Customized Path</h2>
            <p className="text-sm text-muted-foreground">Follow these developmental stages step-by-step</p>
          </div>
          <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-8 pb-8">
            {roadmap.map((step, index) => (
              <div key={index} className="relative pl-8 md:pl-12">
                <div className="absolute -left-[9px] top-1.5 h-4.5 w-4.5 rounded-full bg-primary border-4 border-background shadow-md shadow-primary/20" />
                <Card className="glass-panel border-l-4 border-l-primary glow-card hover:shadow-md transition-all rounded-xl">
                  <CardHeader className="py-4 pb-2">
                    <CardTitle className="text-md font-bold text-primary">Stage {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">{step}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
