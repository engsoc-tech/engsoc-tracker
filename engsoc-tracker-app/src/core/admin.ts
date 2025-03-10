'use server'

import prisma from "@/db/prisma";
import { EngineeringType, PositionType, Role } from "@prisma/client";
import { z } from "zod";
// Import directly from types to avoid circular dependencies

// Application core actions
export const getApplications = async () => {
    const applications = await prisma.application.findMany({
        where: { verified: false },
        orderBy: { openDate: 'desc' }
    });

    // Ensure that nullable boolean values are converted to strictly boolean or undefined
    const formattedApplications = applications.map(app => ({
        ...app,
        requiresCv: app.requiresCv === null ? false : app.requiresCv,
        requiresCoverLetter: app.requiresCoverLetter === null ? undefined : app.requiresCoverLetter,
        requiresWrittenAnswers: app.requiresWrittenAnswers === null ? undefined : app.requiresWrittenAnswers,
        isSponsored: app.isSponsored === null ? false : app.isSponsored,
        notes: app.notes || ""
    }));

    return formattedApplications;
};

export const verifyApplication = async (id: string) => {
    return await prisma.application.update({
        where: { id },
        data: { verified: true }
    });
};

export const updateApplication = async (applicationData: any) => {
    if (!applicationData.id) {
        throw new Error("Application ID is required for updates");
    }

    return await prisma.application.update({
        where: { id: applicationData.id },
        data: applicationData
    });
};

export const createApplication = async (applicationData: any) => {
    // Generate ID if not provided
    const id = applicationData.id ||
        `${applicationData.company}-${applicationData.programme}`.replace(/[\s-]+/g, '-').toLowerCase();

    return await prisma.application.create({
        data: {
            id,
            programme: applicationData.programme,
            origProgramme: applicationData.origProgramme || applicationData.programme,
            company: applicationData.company,
            type: applicationData.type,
            engineering: applicationData.engineering,
            openDate: applicationData.openDate,
            closeDate: applicationData.closeDate,
            requiresCv: applicationData.requiresCv,
            requiresCoverLetter: applicationData.requiresCoverLetter,
            requiresWrittenAnswers: applicationData.requiresWrittenAnswers,
            notes: applicationData.notes || "",
            link: applicationData.link,
            isSponsored: applicationData.isSponsored || false,
            verified: applicationData.verified || false,
            postChecked: applicationData.postChecked || false
        }
    });
};

export const deleteApplication = async (id: string) => {
    return await prisma.application.delete({
        where: { id }
    });
};

// User core actions
export const getUsers = async () => {
    return await prisma.user.findMany({
        orderBy: { name: 'asc' }
    });
};

export const updateUserRole = async (userId: string, role: Role) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { role }
    });
};

// Special actions
export const deleteAllApplications = async () => {
    if (process.env.NODE_ENV === 'production') {
        throw new Error("This action is not allowed in production");
    }

    return await prisma.application.deleteMany({});
};

export const getAppConfig = async () => {
    return await prisma.appConfig.findFirst();
};

export const updateAppConfig = async (configData: {
    shouldKeepUpdating: boolean,
    maxInEachDiscipline: number,
    maxInEachType: number
}) => {
    // Find the config first
    const config = await prisma.appConfig.findFirst();

    if (config) {
        // Update existing config
        return await prisma.appConfig.update({
            where: { id: config.id },
            data: {
                lastUpdated: new Date(),
                ...configData
            }
        });
    } else {
        // Create new config if none exists
        return await prisma.appConfig.create({
            data: {
                id: "config",
                lastUpdated: new Date(),
                ...configData
            }
        });
    }
};
