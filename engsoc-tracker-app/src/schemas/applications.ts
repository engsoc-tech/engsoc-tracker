import { z } from 'zod';
import { ApplicationSchema } from '../../prisma/generated/zod';

export const ModifiedApplicationSchema = ApplicationSchema.omit({ id: true })

export type PositionType = z.infer<typeof ModifiedApplicationSchema>;
export type ApplicationType = z.infer<typeof ApplicationSchema>;