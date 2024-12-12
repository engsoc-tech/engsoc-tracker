
'use server'
import prisma from '../db/prisma';
import { ApplicationType, PositionType } from '../schemas/applications';
import { EngineeringURLtype } from './map';
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

        allApplications = [...await scrapeGradcracker()];

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


export async function updateDatabase(applications: ApplicationType[]): Promise<void> {
    console.log('Updating database with scraped applications...')

    try {
        for (const app of applications) {
            const newApp = await prisma.$transaction(async (tx) => {
                console.log(`Starting transaction for application: ${app.id}`)

                // Check if the application already exists in the database
                console.log(`Checking for existing application with id: ${app.id}`)
                const existingAp = await tx.application.findUnique({
                    where: { id: app.id },
                })

                console.log(`Existing application found: ${existingAp ? 'Yes' : 'No'}`)
                if (existingAp) {
                    console.log(`Updating existing application: ${app.id}`)
                    console.log('Update data:', JSON.stringify(app, null, 2))



                    //PAYLOAD MUST BE OF TYPE OBJECT RECEIVED NULL i stg
                    return await tx.application.update({
                        where: { id: app.id },
                        data: app,
                    })
                    // (If the application exists, update it)
                } else {
                    console.log(`Creating new application: ${app.id}`)
                    console.log('Create data:', JSON.stringify(app, null, 2))

                    // If the application doesn't exist, create a new one
                    return await tx.application.create({
                        data: app,
                    })
                }

                // NOT WORKING FOR SOME REASON. USING MANUAL UPSERT INSTEAD
                // const ap = await prisma.application.upsert({
                //     where: { id: '507f1f77bcf86cd799439011' },
                //     create: app,
                //     update: app
                // })
                // return ap;
            })
            console.log(`Created application: ${newApp.id}`)
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

        // console.log('Removing expired applications...')
        // await removeExpiredApplications()
        // console.log('Expired applications removed.')

        console.log('Scrape job completed successfully.')
    } catch (error) {
        console.error('An error occurred during the scrape job:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            // console.error('Error stack:', error.stack)
        }
    }
}