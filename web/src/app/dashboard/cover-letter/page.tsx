"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, FileText, Loader2, Save, Copy, Building2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      company: "",
      role: "",
      jobDescription: "",
    }
  });

  const formData = watch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async (data: any) => {
    if (!file) {
      toast.error("Please upload your resume PDF.");
      return;
    }

    setIsGenerating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("resume", file);
      formDataToSend.append("company", data.company);
      formDataToSend.append("role", data.role);
      formDataToSend.append("job_description", data.jobDescription || "");

      // Call Python backend
      const response = await fetch("http://127.0.0.1:8000/api/cover-letter", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const result = await response.json();
      if (result.status === "success") {
        setGeneratedLetter(result.data.cover_letter);
        toast.success("Cover letter generated successfully!");
      } else {
        throw new Error(result.detail || "Unknown error");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while generating the cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: formData.role,
          company: formData.company,
          content: generatedLetter,
          jobDescription: formData.jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");
      toast.success("Saved to database!");
    } catch (error) {
      toast.error("Failed to save cover letter.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Cover Letter Writer</h1>
        <p className="text-muted-foreground mt-2">
          Generate highly tailored, ATS-friendly cover letters in seconds based on your resume and a target job description.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input Form */}
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Job Details</CardTitle>
            <CardDescription>Provide details about the target role and company.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleGenerate)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Google" 
                      className="pl-10 h-11 rounded-xl border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                      {...register("company", { required: true })} 
                    />
                  </div>
                  {errors.company && <span className="text-xs text-red-500">Required</span>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Role / Position</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="e.g. Frontend Engineer" 
                      className="pl-10 h-11 rounded-xl border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20" 
                      {...register("role", { required: true })} 
                    />
                  </div>
                  {errors.role && <span className="text-xs text-red-500">Required</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Job Description (Recommended)</Label>
                <Textarea 
                  placeholder="Paste job details here to target specific competencies..." 
                  className="min-h-[160px] resize-none border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl"
                  {...register("jobDescription")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Resume (PDF)</Label>
                <div className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 dark:bg-muted/5 rounded-2xl p-6 transition-all duration-300">
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-semibold">
                      <label htmlFor="resume-upload" className="cursor-pointer text-primary hover:underline">
                        Choose PDF File
                      </label>
                      <span className="text-muted-foreground"> or drag here</span>
                    </div>
                    <p className="text-xs text-muted-foreground">PDF up to 5MB</p>
                    <input 
                      id="resume-upload" 
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
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold gradient-btn rounded-xl" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing & Generating...
                  </>
                ) : (
                  <>✨ Generate Cover Letter</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Right Side: Output */}
        <Card className="glass-panel border-border/70 shadow-md flex flex-col justify-between overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/40 bg-muted/5">
            <div>
              <CardTitle className="text-lg font-bold">Preview Output</CardTitle>
              <CardDescription>Review and download your letter</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!generatedLetter} className="h-9 rounded-lg font-semibold text-xs shadow-sm">
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy
              </Button>
              <Button variant="default" size="sm" onClick={handleSave} disabled={!generatedLetter || isSaving} className="h-9 rounded-lg font-semibold text-xs shadow-sm">
                {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                Save Letter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 flex flex-col bg-muted/10">
            {generatedLetter ? (
              <Textarea 
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="flex-1 min-h-[500px] border-0 focus-visible:ring-0 rounded-none p-6 resize-none leading-relaxed text-[14px] bg-card text-foreground/80 outline-none"
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground border border-border/50 mb-4 select-none">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-foreground">Waiting for Job Details</p>
                <p className="text-xs max-w-xs mt-1 text-muted-foreground">Fill out the left form, attach your resume, and generate a customized matches-based profile cover letter.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
