"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { RemoveMember } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, orgRole } = auth();
  // console.log(orgRole)

  

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, userID } = data;
  let members;

    try {
      members = await db.boardusers.deleteMany({
        where: {
          userId: userID,
        
        },
      });
  
  
    } catch (error) {
      console.log(error)
      return {
        error: "Failed to delete."
      }
    }
  
    revalidatePath(`/board/${id}`);
    return { data: members };
  
  
};

export const removeMember = createSafeAction(RemoveMember, handler);
