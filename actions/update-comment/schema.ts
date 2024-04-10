import { z } from "zod";

export const UpdateComment = z.object({
    cardId: z.string(),
    commentId: z.string(),
    comment: z.string({
    }).min(3, {
        message: "Comment is too short",
    }),
    userCommentedId: z.string()

   
});
