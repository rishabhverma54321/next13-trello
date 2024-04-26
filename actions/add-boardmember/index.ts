"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { AddMember } from "./schema";
import { InputType, ReturnType } from "./types";
import { toast } from "sonner";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, orgRole } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const {  boardId, userID} = data;
  console.log("user Id", userID)
  console.log("Board Id", boardId)
  let addmember;

  const user = await currentUser();
  if (!user || !orgId) {
    throw new Error("User not found!");
  }

 
  
  try {

    const existingAssociation = await db.boardusers.findFirst({
      where: {
        boardId: boardId,
        userId: userId,
      },
    });

    if (existingAssociation) {
      return{
        error:"User Already exist"
      }
    }

    else{
    addmember = await db.boardusers.create({
      data: {


        userId: userID,
        boardId: boardId
        

      },
    });
  }


   
  } catch (error) {
    console.log(error);
    return {
      error: "Failed to Add Member."
    }
  }
  
  // revalidatePath(`/board/${boardId}`);
  return { data: addmember};
};

export const addMember = createSafeAction(AddMember, handler);
