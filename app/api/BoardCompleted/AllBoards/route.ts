import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

export async function GET(

) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const AllBoards = await db.board.findMany({
      where: {
        orgId,
        completed:false
        
      },
      orderBy: {
        createdAt: "desc",
      },  

      
     
    });


    return NextResponse.json(AllBoards);
    
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};

