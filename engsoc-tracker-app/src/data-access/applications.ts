import { ApplicationType } from './../schemas/applications';
import prisma from '@/db/prisma'

export async function saveResultsToDB(results: ApplicationType[]) {
    console.log(`Saving ${results.length} results to database`)

    try {
        for (const result of results) {
            await prisma.application.upsert({
                where: { id: result.id },
                update: {
                    programme: result.programme,
                    company: result.company,
                    type: result.type,
                    engineering: result.engineering,
                    openDate: result.openDate,
                    closeDate: result.closeDate,
                    requiresCv: result.requiresCv,
                    requiresCoverLetter: result.requiresCoverLetter,
                    requiresWrittenAnswers: result.requiresWrittenAnswers,
                    notes: result.notes,
                    link: result.link,
                    isSponsored: result.isSponsored,
                },
                create: result,
            })
        }

        console.log('All results saved successfully')
    } catch (error) {
        console.error('Error saving results to database:', error)
        throw error
    }
}

export async function getApplicationsFromDB(limit?: number, offset?: number) {
    try {
        const [applications, totalCount] = await Promise.all([
            prisma.application.findMany({
                take: limit,
                skip: offset,
                orderBy: {
                    closeDate: 'asc'
                }
            }),
            prisma.application.count()
        ])

        return { applications, totalCount }
    } catch (error) {
        console.error('Error fetching applications from database:', error)
        throw error
    }
}

export async function createApplication(data: Omit<ApplicationType, 'id'>) {
    try {
        return await prisma.application.create({ data })
    } catch (error) {
        console.error('Error creating application:', error)
        throw error
    }
}

export async function updateApplication(id: string, data: Partial<ApplicationType>) {
    try {
        return await prisma.application.update({
            where: { id },
            data,
        })
    } catch (error) {
        console.error('Error updating application:', error)
        throw error
    }
}

export async function deleteApplication(id: string) {
    try {
        return await prisma.application.delete({
            where: { id },
        })
    } catch (error) {
        console.error('Error deleting application:', error)
        throw error
    }
}

