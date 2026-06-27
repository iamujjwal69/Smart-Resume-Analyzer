import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    const { content } = body;

    const coverLetter = await prisma.coverLetter.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        content,
      },
    });

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("[COVER_LETTER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const coverLetter = await prisma.coverLetter.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("[COVER_LETTER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
