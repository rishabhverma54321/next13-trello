import {z} from 'zod';

export const FindList = z.object({
    boardId: z.string()
})