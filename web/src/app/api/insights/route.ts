import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyName } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // Check if we already have insights for this company
    let insight = await prisma.companyInsight.findUnique({
      where: { companyName: companyName.toLowerCase() },
    });

    if (!insight) {
      // We don't have it, so we need to generate it by calling our FastAPI backend
      const formData = new FormData();
      formData.append("company_name", companyName);

      const response = await fetch("http://localhost:8000/api/company/insights", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === "success" && data.data) {
        // Save it to the database for future users
        insight = await prisma.companyInsight.create({
          data: {
            companyName: companyName.toLowerCase(),
            culture: data.data.culture,
            news: data.data.news,
            interview: data.data.interview,
          },
        });
      } else {
        return NextResponse.json({ error: "Failed to generate insights from AI" }, { status: 500 });
      }
    }

    return NextResponse.json(insight);
  } catch (error) {
    console.error("Failed to fetch company insights:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
