import {z} from 'zod';

export const FindMember = z.object({
    boardId: z.string()
})