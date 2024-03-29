import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const comments = await db.comment.findMany({
      where: {
        cardId: params.cardId
      },
      take: 3,
    });

    return NextResponse.json(comments);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
