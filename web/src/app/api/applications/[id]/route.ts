import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application || application.userId !== dbUser.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updatedApp = await prisma.application.update({
      where: { id: params.id },
      data: {
        company: body.company,
        role: body.role,
        status: body.status,
        jobUrl: body.jobUrl,
        salaryRange: body.salaryRange,
        location: body.location,
        jobType: body.jobType,
        priority: body.priority,
        notes: body.notes,
      },
    });

    return NextResponse.json(updatedApp);
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application || application.userId !== dbUser.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
