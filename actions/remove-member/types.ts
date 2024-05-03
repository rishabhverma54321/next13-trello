import { z } from "zod";
import { Boardusers } from "@prisma/client";

import { Prisma } from "@prisma/client"; // Import Prisma from @prisma/client

import { ActionState } from "@/lib/create-safe-action";

import { RemoveMember } from "./schema";

interface DeleteManyResult {
    count: number; // Number of records deleted
  }

export type InputType = z.infer<typeof RemoveMember>;
export type ReturnType = ActionState<InputType, DeleteManyResult>; // Use Prisma.BatchDeleteResult
