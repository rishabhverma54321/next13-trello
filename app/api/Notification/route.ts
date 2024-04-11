import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ENTITY_TYPE } from "@prisma/client";

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

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        
      },
      orderBy: {
        createdAt: "desc",
      },  

      
     
    });

    // if(auditLogs){
    //   const audio = new Audio('/public/Notification.mp3')
    //   audio.play()
    // }

    // const boards = await db.board.findMany({
    //   where: {
    //     orgId,
    //   },
    //   orderBy: {
    //     createdAt: "desc"
    //   }
    // });

    return NextResponse.json(auditLogs);
    
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
};

