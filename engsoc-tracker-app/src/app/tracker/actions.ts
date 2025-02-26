

import { action } from "@/lib/safe-action"
import { z } from "zod"
import { PositionType, EngineeringType } from "@prisma/client"
import { submitApplication } from "@/core/applications"

const ApplicationSchema = z.object({
    programme: z.string(),
    company: z.string(),
    type: z.nativeEnum(PositionType),
    engineering: z.array(z.nativeEnum(EngineeringType)),
    openDate: z.date(),
    closeDate: z.date(),
    requiresCv: z.boolean(),
    requiresCoverLetter: z.boolean(),
    requiresWrittenAnswers: z.boolean(),
    notes: z.string().nullable(),
    link: z.string().url(),
})

export const submitApplicationAction = action.schema(ApplicationSchema).action(async ({ parsedInput }) => {
    try {
        const result = await submitApplication(parsedInput)
        if (result.success) {
            return { success: "Application submitted successfully" }
        } else {
            return { failure: result.error || "Failed to submit application" }
        }
    } catch (error) {
        console.error("Error submitting application:", error)
        return { failure: "An unexpected error occurred" }
    }
})

