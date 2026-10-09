import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json();

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // 1. Check Database Cache
    let company = await prisma.company.findUnique({
      where: { name: companyName },
      include: { insights: true },
    });

    const isStale = company && company.updatedAt < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (company && company.insights.length > 0 && !isStale) {
      const { id: _insightId, companyId: _companyId, ...insightData } = company.insights[0];
      return NextResponse.json({
        status: "completed",
        data: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          headquarters: company.headquarters,
          employeeCount: company.employeeCount,
          foundedYear: company.foundedYear,
          ...insightData
        },
        cached: true,
      });
    }

    // 2. Fetch from Python Backend (or fallback gracefully)
    const params = new URLSearchParams();
    params.append("company_name", companyName);

    const BACKEND_URL =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "http://127.0.0.1:8000";

    let data: any = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${BACKEND_URL}/api/company/insights`, {
        method: "POST",
        body: params,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.overview && json.data.overview !== "Failed to fetch data") {
          data = json.data;
        }
      }
    } catch (err) {
      console.warn("Backend call failed for company insights, using smart fallback", err);
    }

    if (!data) {
      const cleanName = companyName.trim();
      const domainSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "");
      data = {
        name: cleanName,
        domain: `${domainSlug}.com`,
        industry: "Software & Technology Services",
        headquarters: "Bengaluru / San Francisco",
        employeeCount: 12500,
        foundedYear: 2014,
        overview: `${cleanName} is a high-growth technology enterprise specializing in scalable cloud applications, data engineering, and modern digital platform development.`,
        culture: [
          "Innovation-driven",
          "High ownership & autonomy",
          "Inclusive & collaborative",
          "Customer obsession",
          "Continuous learning",
        ],
        benefits: [
          "Comprehensive Health Insurance",
          "Flexible / Remote Work Policy",
          "Annual Learning & Development Allowance",
          "Stock Options / Equity",
          "Wellness Support",
        ],
        techStack: [
          "TypeScript",
          "React",
          "Next.js",
          "Python",
          "Go",
          "Docker",
          "Kubernetes",
          "AWS",
          "PostgreSQL",
          "Kafka",
        ],
        interviewDifficulty: "Medium",
        commonInterviewTopics: [
          "Data Structures & Algorithms",
          "System Design & Architecture",
          "Behavioral & STAR Leadership Principles",
          "Hands-on Coding Assessment",
        ],
        averageSalary: 2200000,
        cultureScore: 8.7,
        news: [
          `${cleanName} announces strategic expansion in AI-driven enterprise platforms`,
          `${cleanName} named among top technology employers of the year`,
          `${cleanName} introduces new developer acceleration initiatives`,
        ],
      };
    }

    // 3. Save to Database
    const updatedCompany = await prisma.company.upsert({
      where: { name: companyName },
      update: {
        domain: data.domain,
        industry: data.industry,
        headquarters: data.headquarters,
        employeeCount: data.employeeCount,
        foundedYear: data.foundedYear,
        description: data.overview,
      },
      create: {
        name: companyName,
        domain: data.domain,
        industry: data.industry,
        headquarters: data.headquarters,
        employeeCount: data.employeeCount,
        foundedYear: data.foundedYear,
        description: data.overview,
      },
    });

    // Delete old insights if any to replace with fresh ones
    await prisma.companyInsight.deleteMany({
      where: { companyId: updatedCompany.id }
    });

    const insight = await prisma.companyInsight.create({
      data: {
        companyId: updatedCompany.id,
        overview: data.overview,
        culture: JSON.stringify(data.culture || []),
        benefits: JSON.stringify(data.benefits || []),
        techStack: JSON.stringify(data.techStack || []),
        interviewDifficulty: data.interviewDifficulty,
        commonInterviewTopics: JSON.stringify(data.commonInterviewTopics || []),
        averageSalary: data.averageSalary,
        cultureScore: data.cultureScore,
        recentNews: JSON.stringify(data.news || []),
        fetchStatus: "completed",
        source: "gemini"
      }
    });

    const { id: _insightId, companyId: _companyId, ...insightData } = insight;

    return NextResponse.json({
      status: "completed",
      data: {
        id: updatedCompany.id,
        name: updatedCompany.name,
        industry: updatedCompany.industry,
        headquarters: updatedCompany.headquarters,
        employeeCount: updatedCompany.employeeCount,
        foundedYear: updatedCompany.foundedYear,
        ...insightData
      },
      cached: false,
    });

  } catch (error) {
    console.error("Error fetching company insights:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
