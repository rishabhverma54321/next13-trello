import { z } from "zod";
import { File } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { CreateFile } from "./schema";

export type InputType = z.infer<typeof CreateFile>;
export type ReturnType = ActionState<InputType, File>;
