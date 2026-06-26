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

    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(roadmaps);
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error);
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
    const { targetRole, missingSkills, recommendations } = body;

    if (!targetRole || !missingSkills || !recommendations) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const roadmap = await prisma.roadmap.create({
      data: {
        userId: dbUser.id,
        targetRole,
        missingSkills: typeof missingSkills === 'string' ? missingSkills : JSON.stringify(missingSkills),
        recommendations: typeof recommendations === 'string' ? recommendations : JSON.stringify(recommendations),
      },
    });

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
