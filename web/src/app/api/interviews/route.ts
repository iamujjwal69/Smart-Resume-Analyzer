import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json([]);
    }

    const interviews = await prisma.interview.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { jobTitle, questions, responses, feedback } = body;

    if (!jobTitle || !questions) {
      return NextResponse.json({ error: "jobTitle and questions are required" }, { status: 400 });
    }

    const interview = await prisma.interview.create({
      data: {
        userId: dbUser.id,
        jobTitle,
        questions: typeof questions === 'string' ? questions : JSON.stringify(questions),
        responses: responses ? (typeof responses === 'string' ? responses : JSON.stringify(responses)) : null,
        feedback: feedback ? (typeof feedback === 'string' ? feedback : JSON.stringify(feedback)) : null,
      },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Failed to create interview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
