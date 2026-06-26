"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mic, Play, Upload, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function InterviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateQuestions = async () => {
    if (!file || !jobDescription) return;
    setIsGenerating(true);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://localhost:8000/api/interview/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success" && data.data.questions) {
        setQuestions(data.data.questions);
        setCurrentQuestion(0);
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
        <h1 className="text-3xl font-extrabold tracking-tight">AI Mock Interview Prep</h1>
        <p className="text-muted-foreground">
          Generate target job competency questions tailored to your experience and practice answering.
        </p>
      </div>

      {questions.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    <label htmlFor="resume-upload-interview" className="cursor-pointer text-primary hover:underline">
                      Choose PDF File
                    </label>
                    <span className="text-muted-foreground"> or drag here</span>
                  </div>
                  <input 
                    id="resume-upload-interview" 
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

          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <Button 
              size="lg" 
              onClick={generateQuestions} 
              disabled={!file || !jobDescription || isGenerating}
              className="w-full md:w-auto px-12 gradient-btn font-semibold rounded-xl text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Mock Interview
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="glass-panel border-border/70 shadow-xl max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Question {currentQuestion + 1} of {questions.length}</div>
            <CardTitle className="text-xl md:text-2xl font-bold leading-relaxed px-4 text-foreground/90">
              &quot;{questions[currentQuestion]}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pb-10">
            {isRecording && (
              <div className="flex items-center gap-1.5 h-10 justify-center">
                <style>{`
                  @keyframes soundwave {
                    0%, 100% { height: 8px; }
                    50% { height: 32px; }
                  }
                  .wave-bar {
                    width: 3px;
                    border-radius: 9999px;
                    background-color: var(--primary);
                  }
                  .bar-1 { animation: soundwave 0.8s ease-in-out infinite; }
                  .bar-2 { animation: soundwave 0.8s ease-in-out infinite 0.15s; }
                  .bar-3 { animation: soundwave 0.8s ease-in-out infinite 0.3s; }
                  .bar-4 { animation: soundwave 0.8s ease-in-out infinite 0.45s; }
                  .bar-5 { animation: soundwave 0.8s ease-in-out infinite 0.2s; }
                  .bar-6 { animation: soundwave 0.8s ease-in-out infinite 0.35s; }
                `}</style>
                <div className="wave-bar bar-1 h-2" />
                <div className="wave-bar bar-2 h-4" />
                <div className="wave-bar bar-3 h-3" />
                <div className="wave-bar bar-4 h-6" />
                <div className="wave-bar bar-5 h-2" />
                <div className="wave-bar bar-6 h-4" />
              </div>
            )}
            
            {!isRecording && <div className="h-10" />}

            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setIsRecording(!isRecording)}
              className={`rounded-full h-16 w-16 p-0 border-primary/25 shadow-md transition-all duration-300 ${
                isRecording 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20 scale-105 border-rose-400' 
                  : 'bg-primary/5 hover:bg-primary/10 text-primary shadow-primary/5 hover:scale-105'
              }`}
            >
              <Mic className="h-6 w-6" />
            </Button>
            <p className="text-xs text-muted-foreground">
              {isRecording ? "Simulating audio recording... Click microphone to finish answer" : "Click microphone to simulate speaking your answer"}
            </p>
            
            <div className="flex gap-4 pt-6 w-full justify-center">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsRecording(false);
                  setCurrentQuestion(Math.max(0, currentQuestion - 1));
                }}
                disabled={currentQuestion === 0}
                className="h-10 rounded-xl px-6 text-xs font-semibold shadow-sm"
              >
                Previous
              </Button>
              <Button 
                onClick={() => {
                  setIsRecording(false);
                  setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1));
                }}
                disabled={currentQuestion === questions.length - 1}
                className="h-10 rounded-xl px-6 text-xs font-semibold shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next Question
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
