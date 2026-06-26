import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PATCH(
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

    const { status, kanbanOrder } = await req.json();

    // Verify ownership
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application || application.userId !== dbUser.id) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (kanbanOrder !== undefined) updateData.kanbanOrder = kanbanOrder;

    const updatedApp = await prisma.application.update({
      where: { id: params.id },
      data: updateData,
    });

    // If status changed, record timeline
    if (status && status !== application.status) {
      await prisma.applicationTimeline.create({
        data: {
          applicationId: params.id,
          status,
          notes: `Moved to ${status}`,
        },
      });
    }

    return NextResponse.json(updatedApp);
  } catch (error) {
    console.error("Failed to update application status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
