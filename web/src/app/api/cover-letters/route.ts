import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in DB", { status: 404 });
    }

    const coverLetters = await prisma.coverLetter.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(coverLetters);
  } catch (error) {
    console.error("[COVER_LETTERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found in DB", { status: 404 });
    }

    const body = await req.json();
    const { jobTitle, company, content, jobDescription } = body;

    if (!jobTitle || !company || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: user.id,
        jobTitle,
        company,
        content,
        jobDescription,
      },
    });

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("[COVER_LETTERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
