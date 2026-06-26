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

    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id },
      orderBy: { kanbanOrder: "asc" },
      include: {
        timeline: {
          orderBy: { date: "desc" },
        },
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
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
    const {
      company,
      role,
      status,
      jobUrl,
      salaryRange,
      location,
      jobType,
      priority,
      notes,
    } = body;

    if (!company || !role) {
      return NextResponse.json({ error: "Company and Role are required" }, { status: 400 });
    }

    // Get the max kanbanOrder for the status column
    const existing = await prisma.application.findFirst({
      where: { userId: dbUser.id, status: status || "WISHLIST" },
      orderBy: { kanbanOrder: "desc" },
    });
    const newOrder = existing ? existing.kanbanOrder + 1024 : 1024;

    const application = await prisma.application.create({
      data: {
        userId: dbUser.id,
        company,
        role,
        status: status || "WISHLIST",
        jobUrl,
        salaryRange,
        location,
        jobType,
        priority,
        notes,
        kanbanOrder: newOrder,
        timeline: {
          create: {
            status: status || "WISHLIST",
            notes: "Job saved",
          },
        },
      },
      include: {
        timeline: true,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
