"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { UpdateComment } from "./schema";
import { InputType, ReturnType } from "./types";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { comment, commentId, cardId} = data;
  let commentdata;

  const user = await currentUser();
  if (!user || !orgId) {
    throw new Error("User not found!");
  }
  
  try {
    
    commentdata = await db.comment.update({

      where:{
        id: commentId
      }, 

      data: {
        comment
      },
    });

    await createAuditLog({
      entityId: commentId,
      entityTitle: commentdata.comment,
      entityType: ENTITY_TYPE.COMMENT,
      action: ACTION.CREATE,
    }); 

  } catch (error) {
    return {
      error: "Failed to update."
    }
  }

  revalidatePath(`/board/${cardId}`);
  return{data: commentdata}
};

export const updateComment = createSafeAction(UpdateComment, handler);
