import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json()

    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" }, 
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name,
      },
    });

    return NextResponse.json(
      { message: "Name updated successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error in Update Name Route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}