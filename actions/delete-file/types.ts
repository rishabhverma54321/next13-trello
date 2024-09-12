import { z } from "zod";
import { File } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteFile } from "./schema";

export type InputType = z.infer<typeof DeleteFile>;
export type ReturnType = ActionState<InputType, File>;
