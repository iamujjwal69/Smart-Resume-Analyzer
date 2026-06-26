"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2, Upload, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function TailorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ summary: string; tailored_bullets: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTailor = async () => {
    if (!file || !jobDescription) return;
    setIsAnalyzing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://localhost:8000/api/resume/tailor", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success") {
        setResult(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Resume Tailoring</h1>
        <p className="text-muted-foreground">
          Let AI perfectly tailor your resume to a specific job description without fabricating experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="text-md font-bold">1. Upload Resume</CardTitle>
            <CardDescription>Select your base PDF resume</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 dark:bg-muted/5 rounded-2xl p-6 transition-all duration-300">
              <div className="flex flex-col items-center justify-center space-y-3 text-center">
                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold">
                  <label htmlFor="resume-upload-tailor" className="cursor-pointer text-primary hover:underline">
                    Choose PDF File
                  </label>
                  <span className="text-muted-foreground"> or drag here</span>
                </div>
                <input 
                  id="resume-upload-tailor" 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </div>
              {file && (
                <div className="mt-4 flex items-center gap-2 p-2.5 bg-primary/8 rounded-xl border border-primary/25">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold truncate text-foreground">{file.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="text-md font-bold">2. Job Description</CardTitle>
            <CardDescription>Paste the target JD</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste target job requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[148px] resize-none border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleTailor} 
          disabled={!file || !jobDescription || isAnalyzing}
          className="w-full md:w-auto px-12 gradient-btn font-semibold rounded-xl text-sm"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Tailoring Resume...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Tailor My Resume
            </>
          )}
        </Button>
      </div>

      {result && (
        <div className="space-y-6 mt-8 animate-in fade-in zoom-in-95 duration-500">
          <Card className="border-green-500/20 bg-green-500/5 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-bold text-green-600 dark:text-green-400">Tailored Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/80">{result.summary}</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-md font-bold text-blue-600 dark:text-blue-400">Optimized Bullet Points</CardTitle>
              <CardDescription>Incorporate these bullet points directly under relevant experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3.5">
                {result.tailored_bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                    <span className="text-blue-500 mt-1 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
