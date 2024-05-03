import {z} from "zod";
import { User } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { FindMember } from "./schema";

export type InputType = z.infer<typeof FindMember>

export type ReturnType = ActionState<InputType, User[] | null>