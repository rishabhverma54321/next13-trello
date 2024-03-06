import {z} from "zod";
import { Board } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { FindBoard } from "./schema";

export type InputType = z.infer<typeof FindBoard>

export type ReturnType = ActionState<InputType, Board | null>