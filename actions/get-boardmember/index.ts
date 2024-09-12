"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { FindMember } from "./schema";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = auth();

  if (!orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const {boardId} = data;
  let usersInOrganization;

  try {
     usersInOrganization = await db.user.findMany({
      where: {
        boards: {
          some: {
            boardId: boardId
          }
        }
      }
    });
  } catch (error) {
    return {
      error: "Faild to find board",
    };
  }

  console.log("board user", usersInOrganization)

  revalidatePath(`/board/${boardId}`);
  return { data: usersInOrganization };
};

export const getMember = createSafeAction(FindMember, handler);
