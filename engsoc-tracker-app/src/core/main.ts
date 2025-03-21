
'use server'
import prisma from '../db/prisma';
import { ApplicationType, PositionType } from '../schemas/applications';
import { EngineeringURLtype } from './map';
import { scrapeGradcracker } from './gradcracker';
import { z } from 'zod';
import { ApplicationSchema } from '../../prisma/generated/zod';
import { scrambleNameWithAI } from './openai/openai';
const SCRAPE_INTERVAL = 5 * 60 * 1000 // 5 minutes
export async function scrapeAllSources(): Promise<ApplicationType[]> {
    console.log('Starting scrape job for all sources...')
    try {
        let allApplications: ApplicationType[] = []
        const config = await prisma.appConfig.findUnique({
            where: { id: 'config' }
        });
        const maxOfEach = config?.maxInEachDiscipline;
        if (!maxOfEach) {
            throw new Error('Max applications per discipline not found in AppConfig')
        }
        allApplications = [...await scrapeGradcracker(maxOfEach)];

        console.log(`Scraping completed. Total applications scraped and saved: ${allApplications.length}`)
        console.log('Updating AppConfig to indicate scrape job is starting...')
        await prisma.appConfig.upsert({
            where: { id: 'config' },
            update: { lastUpdated: new Date() },
            create: { id: 'config', shouldKeepUpdating: false, maxInEachDiscipline: 2, maxInEachType: 2, lastUpdated: new Date() }
        })
        console.log('AppConfig updated successfully REturning all applications')
        return allApplications
    } catch (error) {
        console.error('Error in scrapeAllSources:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }

        console.log('AppConfig updated to reflect failed state.')
        throw error
    }
}


export async function saveApplicationToDatabaseAndScrambleName(app: ApplicationType): Promise<ApplicationType> {
    console.log('Updating database with scraped applications...')

    try {
        const newApp = await prisma.$transaction(async (tx) => {
            console.log(`Starting transaction for application: ${app.id}`)

            // Check if the application already exists in the database
            console.log(`Checking for existing application with id: ${app.id}`)
            const existingAp = await tx.application.findMany({
                where: {
                    origProgramme: app.origProgramme,
                    company: app.company,
                },
            })

            console.log(`Existing application found: ${existingAp ? 'Yes' : 'No'}`)
            if (existingAp.length > 0) {
                console.log(`Updating existing application: ${app.id}`)
                // console.log('Update data:', JSON.stringify(app, null, 2))


                const { id, ...appl } = app;
                console.log("existingapplications with this detail already exists")
                //PAYLOAD MUST BE OF TYPE OBJECT RECEIVED NULL i stg
                return await tx.application.update({
                    where: { id: app.id },
                    data: appl,
                })
                // (If the application exists, update it)
            } else {
                console.log(`Creating new application: ${app.id}`)
                // console.log('Create data:', JSON.stringify(app, null, 2))
                const name = await scrambleNameWithAI(app.programme);
                app.programme = name;

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

        console.log('Database updated successfully')
        return newApp;
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

export async function runScrapeJob(): Promise<{ success?: boolean, error?: string }> {
    console.log('Starting scrape job...')
    try {
        console.log('Initiating scraping from all sources...')
        await scrapeAllSources()
        console.log('Database update completed.')

        console.log('Removing expired applications...')
        await removeExpiredApplications()
        console.log('Expired applications removed.')

        console.log('Scrape job completed successfully.');
        return { success: true }
    } catch (error) {
        console.error('An error occurred during the scrape job:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            // console.error('Error stack:', error.stack)
        }
        return { success: false, error: String(error) }
    }
}