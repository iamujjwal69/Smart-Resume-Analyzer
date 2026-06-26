import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure the user exists in our DB, if not, create them
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "unknown@example.com", // In a real app, grab from Clerk API or webhook
        },
      });
    }

    const body = await req.json();
    const { jobTitle, atsScore, missingKeywords, weakBullets, suggestions } = body;

    const scan = await prisma.scan.create({
      data: {
        userId: dbUser.id,
        jobTitle: jobTitle || "Untitled Scan",
        atsScore,
        missingKeywords: JSON.stringify(missingKeywords),
        weakBullets: JSON.stringify(weakBullets),
        suggestions: JSON.stringify(suggestions),
      },
    });

    return NextResponse.json(scan);
  } catch (error) {
    console.error("Failed to create scan:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
      return NextResponse.json([]); // No user = no scans
    }

    const scans = await prisma.scan.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error("Failed to fetch scans:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
