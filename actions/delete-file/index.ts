"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteFile } from "./schema";
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
  let comment;

if(userID===userId){  
    try {
      comment = await db.file.delete({
        where: {
          id,
        
        },
      });
  
  
    } catch (error) {
      return {
        error: "Failed to delete."
      }
    }
  
    revalidatePath(`/board/${id}`);
    return { data: comment };
  }else{

    return{
      error : "You are not allowed to delete this file"
    }
  }
  
};

export const deleteFile = createSafeAction(DeleteFile, handler);
