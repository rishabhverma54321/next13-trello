"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";

import { CreateFile } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId, orgRole } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { fileName, cardId, downloadUrl} = data;
  let FileData;

  const user = await currentUser();
  if (!user || !orgId) {
    throw new Error("User not found!");
  }

 
  
  try {
    
    FileData = await db.file.create({
      data: {

        fileName: fileName,
        downloadUrl: downloadUrl,
        cardId: cardId,
        userId: userId
        

      },
    });

    // await createAuditLog({
    //   entityId: cardId,
    //   entityTitle: commentdata.comment,
    //   entityType: ENTITY_TYPE.COMMENT,
    //   action: ACTION.CREATE,
    //   userId:userId
    // });

   
  } catch (error) {
    // console.log(error);
    return {
      error: "Failed to upload File"
    }
  }
  
  revalidatePath(`/board/${cardId}`);
  return { data: FileData };
};

export const createFile = createSafeAction(CreateFile, handler);
