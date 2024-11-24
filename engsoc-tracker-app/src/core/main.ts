
'use server'
import prisma from '@/db/prisma';
import { ApplicationType, ModifiedApplicationType } from '@/schemas/applications';
import { engineeringTypes, EngineeringURLtype } from './map';
import { scrapeGradcracker } from './gradcracker';
import { z } from 'zod';
import { ApplicationSchema } from '../../prisma/generated/zod';
const SCRAPE_GRADCRACKER_INTERVAL = 5 * 60 * 1000 // 5 minutes
export async function scrapeAllSources(): Promise<ApplicationType[]> {
    console.log('Starting scrape job for all sources...')

    try {
        console.log('Checking if a scrape job is already running...')
        let config;
        try {
            console.log('Querying AppConfig...')
            config = await prisma.appConfig.findUnique({
                where: {
                    id: 'config'
                }
            })
            console.log('AppConfig query result:', config)
        } catch (prismaError) {
            console.error('Error querying AppConfig:', prismaError)
            throw prismaError
        }
        //ENABLE LATER
        // if (config?.isUpdating) {
        //     console.log('Scrape job is already running. Exiting...')
        //     return []
        // }

        console.log('Updating AppConfig to indicate scrape job is starting...')
        await prisma.appConfig.upsert({
            where: { id: 'config' },
            update: { isUpdating: true, lastUpdated: new Date() },
            create: { id: 'config', isUpdating: true, lastUpdated: new Date() }
        })
        console.log('AppConfig updated successfully.')

        let allApplications: ApplicationType[] = []

        for (const [type, typeName] of engineeringTypes) {
            console.log(`Starting scrape for ${typeName}...`)
            const applications = await scrapeGradcracker(
                type as EngineeringURLtype
            )

            // console.log(`Finished scraping ${typeName}. Found ${applications.length} applications.`)
            allApplications = [...allApplications, ...applications]

            console.log("AllApplications: " + allApplications)
        }
        // if (type !== 'mechanical-engineering') {  // Don't delay after the last type
        //     console.log(`Waiting for 5 minutes before scraping next type...`)
        //     await new Promise(resolve => setTimeout(resolve, SCRAPE_GRADCRACKER_INTERVAL))
        //     console.log('5-minute wait completed.')
        // }
        // }

        console.log(`Scraping completed. Total applications scraped: ${allApplications.length}`)

        console.log('Updating AppConfig to indicate scrape job is finished...')
        await prisma.appConfig.update({
            where: { id: 'config' },
            data: { isUpdating: false, lastUpdated: new Date() }
        })
        console.log('AppConfig updated successfully.')

        return allApplications
    } catch (error) {
        console.error('Error in scrapeAllSources:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
        console.log('Updating AppConfig to indicate scrape job failed...')
        await prisma.appConfig.update({
            where: { id: 'config' },
            data: { isUpdating: false, lastUpdated: new Date() }
        })
        console.log('AppConfig updated to reflect failed state.')
        throw error
    }
}


export async function updateDatabase(applications: ModifiedApplicationType[]): Promise<void> {
    console.log('Updating database with scraped applications...')

    try {
        for (const app of applications) {
            console.log("Upserting application:" + app.programme)
            console.dir(app, { depth: null })
            const ap = await prisma.application.create({
                // where: { id: app.id },
                data: { ...app, type: (app.type.toUpperCase() as ApplicationType['type']) },
                // create: { ...app, type: (app.type.toUpperCase() as ApplicationType['type']) },
            })
            console.log(`Created application: ${ap.id}`)
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
    console.log('Starting scrape job...')
    try {
        console.log('Initiating scraping from all sources...')
        const applications: z.infer<typeof ApplicationSchema>[] = await scrapeAllSources()
        console.log(`Scraping completed. ${applications.length} applications found.`)

        console.log('Updating database with new applications...')
        await updateDatabase(applications)
        console.log('Database update completed.')

        console.log('Removing expired applications...')
        await removeExpiredApplications()
        console.log('Expired applications removed.')

        console.log('Scrape job completed successfully.')
    } catch (error) {
        console.error('An error occurred during the scrape job:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
    }
}