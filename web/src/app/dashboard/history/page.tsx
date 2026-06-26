"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit } from "lucide-react";

type Scan = {
  id: string;
  jobTitle: string;
  atsScore: number;
  createdAt: string;
};

type CoverLetter = {
  id: string;
  jobTitle: string;
  company: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scansRes, coverLettersRes] = await Promise.all([
          fetch("/api/scans"),
          fetch("/api/cover-letters"),
        ]);
        
        if (scansRes.ok) {
          const data = await scansRes.json();
          setScans(data);
        }
        if (coverLettersRes.ok) {
          const data = await coverLettersRes.json();
          setCoverLetters(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Your History</h1>
        <p className="text-gray-500 mt-2">View your past resume scans and generated cover letters.</p>
      </div>

      <Tabs defaultValue="scans" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="scans" className="text-base px-6">Resume Scans</TabsTrigger>
          <TabsTrigger value="cover-letters" className="text-base px-6">Cover Letters</TabsTrigger>
        </TabsList>

        <TabsContent value="scans">
          {loading ? (
            <div className="text-gray-500">Loading history...</div>
          ) : scans.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-500 mb-6">Upload your first resume and job description to get an ATS score.</p>
              <Link
                href="/dashboard/upload"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Analysis
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {scans.map((scan) => (
                <div key={scan.id} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => window.location.href = `/dashboard/results?id=${scan.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{scan.jobTitle}</h3>
                      <p className="text-sm text-gray-500">{new Date(scan.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">ATS Score</p>
                      <p className={`font-bold text-xl ${scan.atsScore >= 80 ? 'text-green-600' : scan.atsScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {scan.atsScore}/100
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cover-letters">
          {loading ? (
            <div className="text-gray-500">Loading history...</div>
          ) : coverLetters.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Edit className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No cover letters yet</h3>
              <p className="text-gray-500 mb-6">Generate your first highly tailored cover letter.</p>
              <Link
                href="/dashboard/cover-letter"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Generate Cover Letter
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {coverLetters.map((cl) => (
                <div key={cl.id} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Edit className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{cl.jobTitle} at {cl.company}</h3>
                      <p className="text-sm text-gray-500">{new Date(cl.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
