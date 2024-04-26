import { z } from "zod";
import { Boardusers } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { AddMember } from "./schema";

export type InputType = z.infer<typeof AddMember>;
export type ReturnType = ActionState<InputType, Boardusers>;
