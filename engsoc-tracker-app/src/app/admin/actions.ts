import { action } from "@/lib/safe-action";
import { z } from "zod";
import * as coreActions from "@/core/admin";
import { EngineeringType, PositionType } from "@prisma/client";
import { migrateDatabase } from "@/lib/migrations";
import { runScrapeJob } from "@/core/main";

// Schema definitions
const applicationSchema = z.object({
    id: z.string().optional(),
    programme: z.string(),
    origProgramme: z.string().optional(),
    company: z.string(),
    type: z.nativeEnum(PositionType),
    engineering: z.array(z.nativeEnum(EngineeringType)),
    openDate: z.date(),
    closeDate: z.date(),
    requiresCv: z.boolean().optional(),
    requiresCoverLetter: z.boolean().optional(),
    requiresWrittenAnswers: z.boolean().optional(),
    notes: z.string().optional(),
    link: z.string(),
    isSponsored: z.boolean().optional().default(false),
    verified: z.boolean().optional().default(false),
    postChecked: z.boolean().optional().default(false)
});

const userRoleSchema = z.object({
    userId: z.string(),
    role: z.enum(["USER", "ADMIN", "SUPER"])
});

// Application actions
export const getApplicationsAction = action.action(async () => {
    try {
        const applications = await coreActions.getApplications();
        return { success: true, data: applications };
    } catch (error) {
        console.error("Error fetching applications:", error);
        return { success: false, error: "Failed to fetch applications, " + error };
    }
});

export const verifyApplicationAction = action.schema(z.object({
    id: z.string()
})).action(async ({ parsedInput }) => {
    try {
        const updated = await coreActions.verifyApplication(parsedInput.id);
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error verifying application:", error);
        return { success: false, error: "Failed to verify application" };
    }
});

export const updateApplicationAction = action.schema(applicationSchema).action(async ({ parsedInput }) => {
    try {
        const updated = await coreActions.updateApplication(parsedInput);
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating application:", error);
        return { success: false, error: "Failed to update application" };
    }
});

export const createApplicationAction = action.schema(applicationSchema).action(async ({ parsedInput }) => {
    try {
        const created = await coreActions.createApplication(parsedInput);
        return { success: true, data: created };
    } catch (error) {
        console.error("Error creating application:", error);
        return { success: false, error: "Failed to create application" };
    }
});

export const deleteApplicationAction = action.schema(z.object({
    id: z.string()
})).action(async ({ parsedInput }) => {
    try {
        await coreActions.deleteApplication(parsedInput.id);
        return { success: true };
    } catch (error) {
        console.error("Error deleting application:", error);
        return { success: false, error: "Failed to delete application" };
    }
});

// User actions
export const getUsersAction = action.action(async () => {
    try {
        const users = await coreActions.getUsers();
        return { success: true, data: users };
    } catch (error) {
        console.error("Error fetching users:", error);
        return { success: false, error: "Failed to fetch users" };
    }
});

export const updateUserRoleAction = action.schema(userRoleSchema).action(async ({ parsedInput }) => {
    try {
        const updated = await coreActions.updateUserRole(parsedInput.userId, parsedInput.role);
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating user role:", error);
        return { success: false, error: "Failed to update user role" };
    }
});

// Super admin actions
export const invokeFunctionAction = action.schema(z.object({
    input: z.string().optional()
})).action(async ({ parsedInput }) => {
    try {
        if (parsedInput?.input) {
            // Logic to invoke a function with the given input
            console.log("Testing function with input:", parsedInput.input);
            return { success: true, message: `Processed ${parsedInput.input}` };
        }
        return { success: false, error: "No input provided" };
    } catch (error) {
        console.error("Error in function:", error);
        return { success: false, error: "An unexpected error occurred: " + error };
    }
});

export const scrapeAllSourcesAction = action.action(async () => {
    try {
        console.log("Starting scrape all sources job");
        // Call to the actual scraping function would go here
        const res = await runScrapeJob();
        return { success: true, message: "Scraping completed successfully" };
    } catch (error) {
        console.error("Error scraping sources:", error);
        return { success: false, error: "An unexpected error occurred: " + error };
    }
});

export const migrateDbAction = action.action(async () => {
    try {
        console.log("Starting database migration");
        // Call to the actual migration function would go here
        await migrateDatabase();
        return { success: true, message: "Migration completed successfully" };
    } catch (error) {
        console.error("Error migrating database:", error);
        return { success: false, error: "An unexpected error occurred: " + error };
    }
});

export const deleteButtonClickAction = action.action(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return { data: { success: false }, message: "This action is not allowed in production" };
        }

        await coreActions.deleteAllApplications();
        return { data: { success: true }, message: "All applications deleted successfully" };
    } catch (error) {
        console.error("Error deleting applications:", error);
        return { data: { success: false }, message: "Error deleting applications: " + error };
    }
});

export const getAppConfigAction = action.action(async () => {
    try {
        const config = await coreActions.getAppConfig();
        return { success: true, data: config };
    } catch (error) {
        console.error("Error fetching app config:", error);
        return { success: false, error: "Failed to fetch app config" };
    }
});

export const updateAppConfigAction = action.schema(z.object({
    shouldKeepUpdating: z.boolean(),
    maxInEachDiscipline: z.number(),
    maxInEachType: z.number()
})).action(async ({ parsedInput }) => {
    try {
        const updated = await coreActions.updateAppConfig(parsedInput);
        return { success: true, data: updated };
    } catch (error) {
        console.error("Error updating app config:", error);
        return { success: false, error: "Failed to update app config" };
    }
});