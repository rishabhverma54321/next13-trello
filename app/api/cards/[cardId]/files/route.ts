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

    const files = await db.file.findMany({
      where: {
        cardId: params.cardId
      },
      
    });


    return NextResponse.json(files);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};
