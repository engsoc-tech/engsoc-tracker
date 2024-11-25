import prisma from '@/db/prisma'
import { ApplicationType } from '@/schemas/applications'


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

export async function addApplication(application: Omit<ApplicationType, 'id'>): Promise<ApplicationType> {
    const newApplication = await prisma.application.create({
        data: application
    })

    return newApplication
}

export async function updateApplication(id: string, application: Partial<ApplicationType>): Promise<ApplicationType> {
    const updatedApplication = await prisma.application.update({
        where: { id },
        data: application
    })

    return updatedApplication
}

export async function deleteApplication(id: string): Promise<void> {
    await prisma.application.delete({
        where: { id }
    })
}

