import {z} from 'zod';

export const FindBoard = z.object({
    boardId: z.string()
})