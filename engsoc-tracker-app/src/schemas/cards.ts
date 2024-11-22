import { z } from 'zod';

export const CardSchema = z.object({
    id: z.string(),
    programme: z.string(),
    company: z.string(),
    type: z.string(),
    engineering: z.string(),
    openDate: z.string().datetime(),
    closeDate: z.string().datetime(),
    requiresCv: z.boolean(),
    requiresCoverLetter: z.boolean(),
    requiresWrittenAnswers: z.boolean(),
    notes: z.string().optional(),
    link: z.string().url(),
});

export type CardType = z.infer<typeof CardSchema>;