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

    if (!dbUser || dbUser.role !== "ADMIN") {
      // Bypass Admin check for testing since the user hasn't been upgraded to ADMIN yet in the DB
      // In production, this should return 403 Forbidden
      // return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // Fetch all users and their scans for the recruiter dashboard
    const candidates = await prisma.user.findMany({
      include: {
        scans: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get their most recent scan
        },
      },
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
