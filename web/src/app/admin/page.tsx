"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Search } from "lucide-react";

export default function AdminPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const res = await fetch("/api/admin/candidates");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCandidates(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 page-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Recruiter Portal</h1>
          <p className="text-muted-foreground mt-2">Manage candidates and view ATS scores across the platform.</p>
        </div>
        <div className="bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-900/30 px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wider select-none shadow-sm">
          Admin Mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{candidates.length}</div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Scans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">
              {candidates.reduce((acc, c) => acc + (c.scans ? c.scans.length : 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-panel border-border/70 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Health</CardTitle>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight text-green-600 dark:text-green-400">Online</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-lg overflow-hidden">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="text-lg font-bold">Candidate Database</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center px-3.5 py-2 border border-border/70 rounded-xl mb-6 max-w-sm bg-muted/20 focus-within:border-primary transition-colors">
            <Search className="h-4 w-4 text-muted-foreground mr-2.5" />
            <input 
              placeholder="Search by skill or job title..." 
              className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="rounded-xl border border-border/60 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border/50 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-4 font-bold">User Email</th>
                  <th className="px-5 py-4 font-bold">Latest Job Title</th>
                  <th className="px-5 py-4 font-bold">Highest ATS Score</th>
                  <th className="px-5 py-4 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground font-medium">Loading candidate data...</td>
                  </tr>
                ) : candidates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground font-medium">No candidates logged in database.</td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr key={candidate.id} className="border-t border-border/40 hover:bg-muted/10 transition-colors">
                      <td className="px-5 py-4 font-medium">{candidate.email}</td>
                      <td className="px-5 py-4 text-foreground/80">
                        {candidate.scans && candidate.scans.length > 0 ? candidate.scans[0].jobTitle : "No scans"}
                      </td>
                      <td className="px-5 py-4">
                        {candidate.scans && candidate.scans.length > 0 ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                            candidate.scans[0].atsScore >= 80 
                              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
                              : candidate.scans[0].atsScore >= 60 
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}>
                            {candidate.scans[0].atsScore}/100
                          </span>
                        ) : "-"}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(candidate.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
