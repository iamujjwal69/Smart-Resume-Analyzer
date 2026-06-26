"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, Sparkles, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file || !jobDescription.trim()) return;
    setIsAnalyzing(true);
    setProgress(15);
    
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("job_description", jobDescription);
      
      setProgress(40);
      
      const response = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      setProgress(85);
      
      if (!response.ok) {
        throw new Error("Failed to analyze resume.");
      }
      
      const data = await response.json();
      const analysisData = data.data;

      setProgress(95);

      // Save to database
      try {
        const saveRes = await fetch("/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: "Software Engineer", // You might extract this from JD later
            atsScore: analysisData.ats_score,
            missingKeywords: analysisData.missing_keywords,
            weakBullets: analysisData.weak_bullets,
            suggestions: analysisData.suggestions,
          }),
        });
        const savedScan = await saveRes.json();
        // Pass the ID to the results page
        if (savedScan && savedScan.id) {
          analysisData.id = savedScan.id;
        }
      } catch (saveErr) {
        console.error("Failed to save scan to history", saveErr);
      }

      setProgress(100);
      
      // Store result in sessionStorage to pass to the next page
      sessionStorage.setItem("analysisResult", JSON.stringify(analysisData));
      
      setTimeout(() => {
        router.push('/dashboard/results');
      }, 500);
      
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume. Please check if the backend is running.");
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Analyze Your Resume</h1>
        <p className="text-muted-foreground mt-2">
          Get real-time ATS match scoring, detailed feedback on formatting, and missing target keywords.
        </p>
      </div>

      <Card className="glass-panel overflow-hidden border border-border/70 shadow-xl">
        <CardContent className="p-6 md:p-8">
          {!isAnalyzing ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Resume Upload Column */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                  Upload Base Resume
                </h3>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 h-72 flex flex-col items-center justify-center group ${
                    isDragging 
                      ? 'border-primary bg-primary/8 scale-101' 
                      : 'border-border hover:border-primary/50 bg-muted/20 dark:bg-muted/5'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card border border-border/40 text-primary shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1 max-w-full truncate px-4">
                    {file ? file.name : "Drag and drop your file here"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF, DOCX, or TXT (Max 5MB)"}
                  </p>
                  
                  <input 
                    type="file" 
                    id="resume-upload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="cursor-pointer bg-card border border-border/80 shadow-sm px-4 py-2 rounded-xl text-xs font-semibold hover:bg-muted/50 transition-colors"
                  >
                    Choose PDF File
                  </label>
                </div>
              </div>

              {/* Job Description Column */}
              <div className="flex flex-col space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                  Target Job Description
                </h3>
                <Textarea 
                  className="flex-1 min-h-[150px] resize-none border border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-2xl p-4 text-sm"
                  placeholder="Paste the job description here. Our AI engine will run semantic keyword analysis to find matches and identify critical skill gaps..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="py-16 px-6 text-center max-w-md mx-auto space-y-6 animate-pulse">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm mx-auto">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Analyzing Resume...</h3>
                <p className="text-sm text-muted-foreground">Extracting content, validating skills, and matching keywords against requirements.</p>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="w-full bg-muted dark:bg-muted/20 rounded-full h-2 overflow-hidden border border-border/30">
                  <div 
                    className="bg-gradient-to-r from-primary to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>{progress < 40 ? "Parsing..." : progress < 85 ? "Scoring..." : "Finishing..."}</span>
                  <span>{progress}%</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {!isAnalyzing && (
          <div className="bg-muted/30 dark:bg-muted/10 p-4 border-t border-border/50 flex justify-end gap-3">
            <Button 
              onClick={startAnalysis}
              disabled={!file || !jobDescription.trim()}
              className="gradient-btn font-semibold px-6 py-2.5 rounded-xl text-sm"
            >
              Start AI Analysis <Sparkles className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

