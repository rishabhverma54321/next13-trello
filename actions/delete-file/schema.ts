import { z } from "zod";

export const DeleteFile = z.object({
  id: z.string(),
  userID: z.string()
});
