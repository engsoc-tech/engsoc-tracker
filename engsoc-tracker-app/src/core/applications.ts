'use server'
import prisma from '@/db/prisma'
import { ApplicationType } from '@/schemas/applications'
import { Application } from '@prisma/client';


export async function getApplications(limit: number, offset: number): Promise<ApplicationType[]> {
    const applications = await prisma.application.findMany({
        take: limit,
        skip: offset,
        orderBy: {
            closeDate: 'asc'
        }
    })

    return applications
}


export async function submitApplication(
    data: Omit<Application, "id" | "isSponsored" | "verified" | "origProgramme" | "postChecked">,
): Promise<{ success: boolean; data?: Application; error?: string }> {
    console.log(" [submitApplication]  data:", data)
    try {
        const application = await prisma.application.create({
            data: {
                ...data,
                origProgramme: data.programme,
                id: `${data.company}-${data.programme}`.replace(/[\s-]+/g, '-').toLowerCase(),
                isSponsored: false,
                verified: false,
            },
        })
        return { success: true, data: application }
    } catch (error) {
        console.error("Error submitting application:", error)
        return { success: false, error: "Failed to submit application" }
    }
}



export async function updateApplication(_id: string, application: Partial<ApplicationType>): Promise<ApplicationType> {
    const { id, ...app } = application;
    const updatedApplication = await prisma.application.upsert({
        where: { id: _id },
        update: app,
        create: {
            id: _id,
            ...app
        } as any
    })

    return updatedApplication
}

export async function deleteApplication(id: string): Promise<void> {
    await prisma.application.delete({
        where: { id }
    })
}

export async function deleteApplications(): Promise<void> {
    await prisma.application.deleteMany()
}
