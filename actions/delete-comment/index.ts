"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteComment } from "./schema";
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

  const { id } = data;
  let comment;

  try {
    comment = await db.comment.delete({
      where: {
        id,
      
      },
    });

    await createAuditLog({
      entityTitle: comment.comment,
      entityId: comment.id,
      entityType: ENTITY_TYPE.COMMENT,
      action: ACTION.DELETE,
    })
  } catch (error) {
    return {
      error: "Failed to delete."
    }
  }

  revalidatePath(`/board/${id}`);
  return { data: comment };
};

export const deleteComment = createSafeAction(DeleteComment, handler);
