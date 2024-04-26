import { z } from "zod";

export const AddMember = z.object({
    boardId: z.string(),
    userID:  z.string()

});
