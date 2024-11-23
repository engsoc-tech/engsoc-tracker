import { z } from 'zod';

export const ApplicationSchema = z.object({
    id: z.string(),
    programme: z.string(),
    company: z.string(),
    type: z.enum(['Internship', 'Placement', 'Graduate-Scheme']),
    engineering: z.string(),
    salary: z.string().optional(),
    location: z.string().optional(),
    openDate: z.string().datetime(),
    closeDate: z.string().datetime(),
    requiresCv: z.boolean(),
    requiresCoverLetter: z.boolean(),
    requiresWrittenAnswers: z.boolean(),
    isSponsored: z.boolean().optional(),
    notes: z.string().optional(),
    link: z.string().url(),
});

export type ApplicationType = z.infer<typeof ApplicationSchema>;