

import { action } from "@/lib/safe-action"
import { z } from "zod"
import { PositionType, EngineeringType } from "@prisma/client"
import { getGradcrackerOutLink } from "@/core/gradcracker/getOutLinks"
import { setCronStatus } from "@/core/cron/status"
import { scrapeGradcracker, scrapeGradcrackerDiscipline } from "@/core/gradcracker"
import { runScrapeJob } from "@/core/main"

const schema = z.object({
    input: z.string().optional()
})
export const invokeFunctionAction = action.schema(schema).action(async ({ parsedInput }) => {
    try {
        const result = await runScrapeJob();
        if (result) {
            return { success: result }
        } else {
            return "No response"
        }
    } catch (error) {
        console.error("Error submitting application:", error)
        return { failure: "An unexpected error occurred" + error }
    }
})

const setCronJobSchema = z.boolean();
export const setScrapeJobShouldKeepUpdatingAction = action.schema(setCronJobSchema).action(async ({ parsedInput }) => {
    try {
        await setCronStatus(parsedInput)
        return { success: true }
    } catch (error) {
        console.error("Error submitting application:", error)
        return { failure: "An unexpected error occurred" + error }
    }
})