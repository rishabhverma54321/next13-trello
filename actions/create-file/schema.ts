import { z } from "zod";

export const CreateFile = z.object({
    cardId: z.string(),
    fileName: z.string(),
    downloadUrl: z.string()


});
