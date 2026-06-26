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
      return NextResponse.json({
        status: "completed",
        data: {
          id: company.id,
          name: company.name,
          industry: company.industry,
          headquarters: company.headquarters,
          employeeCount: company.employeeCount,
          foundedYear: company.foundedYear,
          ...company.insights[0] // Spread insight properties
        },
        cached: true,
      });
    }

    // 2. Fetch from Python Backend (which uses Gemini as the primary enricher)
    const formData = new FormData();
    formData.append("company_name", companyName);

    const response = await fetch("http://localhost:8000/api/company/insights", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const { data } = await response.json();

    // 3. Save to Database
    company = await prisma.company.upsert({
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
      where: { companyId: company.id }
    });

    const insight = await prisma.companyInsight.create({
      data: {
        companyId: company.id,
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

    return NextResponse.json({
      status: "completed",
      data: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        headquarters: company.headquarters,
        employeeCount: company.employeeCount,
        foundedYear: company.foundedYear,
        ...insight
      },
      cached: false,
    });

  } catch (error) {
    console.error("Error fetching company insights:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
