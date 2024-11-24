
import prisma from '@/db/prisma';
import { ApplicationType } from '@/schemas/applications';
import { engineeringTypes, EngineeringURLtype } from './map';
import { scrapeGradcracker } from './gradcracker';

export async function scrapeAllSources(): Promise<ApplicationType[]> {
    console.log('Starting scrape job for all sources...')

    try {
        //if it's already updating, don't run the job
        const config = await prisma.appConfig.findUnique({
            where: { id: 'config' }
        })
        if (config?.isUpdating) {
            console.log('Scrape job is already running. Exiting...')
            return []
        }

        await prisma.appConfig.upsert({
            where: { id: 'config' },
            update: { isUpdating: true, lastUpdated: new Date() },
            create: { id: 'config', isUpdating: true, lastUpdated: new Date() }
        })

        let allApplications: ApplicationType[] = []

        for (const [type, typeName] of engineeringTypes) {
            console.log(`Scraping ${typeName}...`)
            const applications = await scrapeGradcracker(type as EngineeringURLtype)
            allApplications = [...allApplications, ...applications]

            if (type !== 'mechanical-engineering') {  // Don't delay after the last type
                console.log('Waiting for 5 minutes before next scrape...')
                await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000))
            }
        }

        console.log(`Total applications scraped: ${allApplications.length}`)

        await prisma.appConfig.update({
            where: { id: 'config' },
            data: { isUpdating: false, lastUpdated: new Date() }
        })

        return allApplications
    } catch (error) {
        console.error('Error in scrapeAllSources:', error)
        await prisma.appConfig.update({
            where: { id: 'config' },
            data: { isUpdating: false, lastUpdated: new Date() }
        })
        throw error
    }
}


export async function updateDatabase(applications: ApplicationType[]): Promise<void> {
    console.log('Updating database with scraped applications...')

    try {
        for (const app of applications) {
            await prisma.application.upsert({
                where: { id: app.id },
                update: { ...app, type: app.type.toUpperCase() as any },
                create: { ...app, type: app.type.toUpperCase() as any },
            })
            console.log(`Upserted application: ${app.id}`)
        }
        console.log('Database updated successfully')
    } catch (error) {
        console.error('Error in updateDatabase:', error)
        throw error
    }
}

export async function removeExpiredApplications(): Promise<void> {
    console.log('Removing expired applications...')

    try {
        const currentDate = new Date()
        const result = await prisma.application.deleteMany({
            where: {
                closeDate: {
                    lt: currentDate
                }
            }
        })
        console.log(`Removed ${result.count} expired applications`)
    } catch (error) {
        console.error('Error removing expired applications:', error)
        throw error
    }
}

export async function runScrapeJob(): Promise<void> {
    try {
        const applications = await scrapeAllSources()
        await updateDatabase(applications)
        await removeExpiredApplications()
    } catch (error) {
        console.error('An error occurred during the scrape job:', error)
    } finally {
        await prisma.$disconnect()
        console.log('Prisma client disconnected')
    }
}