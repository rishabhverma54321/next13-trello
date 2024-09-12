// pages/api/notification.ts

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

const prisma = new PrismaClient();


export async function POST(request: Request) {
    try {
      const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await request.json();
        const { notificationId } = data;

        // Ensure that the notification belongs to the current user before marking it as read
     
     

        // Update the isRead field of the notification in the database
        await db.auditLog.update({
            where: { id: notificationId },
            data: { isRead: true },
        });

        // console.log("Item pressed")

        return new NextResponse(""); 
  

    } catch (error) {
      // console.error("Error marking notification as read:", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }