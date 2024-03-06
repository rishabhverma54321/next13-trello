import {z} from "zod";
import { List, Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { FindList } from "./schema";
import { ListWithCards } from "@/types";

export type InputType = z.infer<typeof FindList>
export type ReturnType = ActionState<InputType,ListWithCards[]>