import { z } from 'zod';

export const ApplicationSchema = z.object({
    id: z.string(),
    programme: z.string(),
    company: z.string(),
    type: z.enum(['Internship', 'Placement', 'Graduate']),
    engineering: z.string(),
    // salary: z.string().nullable(),
    openDate: z.date().nullable(),
    closeDate: z.date().nullable(),
    requiresCv: z.boolean().nullable(),
    requiresCoverLetter: z.boolean().nullable(),
    requiresWrittenAnswers: z.boolean(),
    isSponsored: z.boolean(),
    notes: z.string().nullable(),
    link: z.string().url(),
});

export type ApplicationType = z.infer<typeof ApplicationSchema>;