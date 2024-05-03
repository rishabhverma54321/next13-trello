import { z } from "zod";

export const RemoveMember = z.object({

  id: z.string(),
  userID: z.string()
});
