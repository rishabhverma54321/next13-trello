"use server"

import { createSafeAction } from "@/lib/create-safe-action";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { FindList } from "./schema";
import { revalidatePath } from "next/cache";

const handler = async(data:InputType):Promise<ReturnType> => {
    const { orgId } = auth();

    if (!orgId) {
      return {
        error: "Unauthorized",
        };
    }

    const {boardId} = data;

    let lists;
    
    try{
         lists = await db.list.findMany({
          where: {
            boardId: boardId,
            board: {
              orgId,
            },
          },
          include: {
            cards: {
              orderBy: {
                order: "asc",
              },
            },
          },
          orderBy: {
            order: "asc",
          },
        });
    }catch(error){
        return {
            error: "Faild to find board"
        }
    }

    revalidatePath(`/board/${boardId}`);
    return { data: lists };
}

export const getList = createSafeAction(FindList, handler);
