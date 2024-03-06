"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { FindBoard } from "./schema";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = auth();

  if (!orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const {boardId} = data;
  let board;

  try {
    board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });
  } catch (error) {
    return {
      error: "Faild to find board",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: board };
};

export const getBoard = createSafeAction(FindBoard, handler);
