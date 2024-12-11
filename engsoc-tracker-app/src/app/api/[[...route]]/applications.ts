import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

import { ModifiedApplicationSchema } from '@/schemas/applications'
import { rateLimit } from '@/middleware/rateLimit'
import prisma from '@/db/prisma'
import { getApplications } from '@/core/applications'
import { mockApplications } from '@/lib/mock-data'


const applicationsRoute = new Hono()

applicationsRoute.use('*', rateLimit({ limit: 100, period: 60000 })) // 100 requests per minute

applicationsRoute.get('/', zValidator('query', z.object({
    _limit: z.string().optional().default("10"),
    _offset: z.string().optional().default("0")
})), async (c) => {
    console.log('Received GET request for applications')
    const { _limit, _offset } = c.req.valid('query')
    const limit = parseInt(_limit)
    const offset = parseInt(_offset)
    console.log(`Fetching applications with limit: ${limit}, offset: ${offset}`)

    try {
        // const applications = await fetchApplicationsFromDB(limit, offset)
        // console.log(`Fetched ${applications.length} applications. They are: ${console.dir(applications, { depth: null })}`)
        // const validatedApplications = z.array(ModifiedApplicationSchema).parse(applications)
        // console.log('Applications data validated successfully')


        //return mock data instead
        const validatedApplications = z.array(ModifiedApplicationSchema).parse(mockApplications)

        return c.json({
            success: true,
            data: validatedApplications
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors)
            return c.json({ success: false, error: 'The internal applications schema didnt match the ModifiedApplicationSchema type. (Are you using incorrectly generated mock data?)' }, 400)
        }
        console.error('Error fetching applications:', error)
        return c.json({ success: false, error: 'Internal server error' }, 500)
    }
})

async function fetchApplicationsFromDB(limit: number, offset: number): Promise<z.infer<typeof ModifiedApplicationSchema>[]> {
    console.log(`Fetching applications from DB with limit: ${limit}, offset: ${offset}`);
    try {
        console.log('Querying database...');
        const applications = await getApplications(limit, offset);
        console.log(`Retrieved ${applications.length} applications from database`);
        console.log('Raw applications:');
        console.dir(applications, { depth: null });

        console.log('Converting application data...');
        const convertedApplications = applications.map(app => {
            console.log(`Converting application with ID: ${app.id}`);
            const convertedApp = {
                ...app,
                type: app.type,
                requiresCv: app.requiresCv ?? false,
                requiresCoverLetter: app.requiresCoverLetter ?? false,
                requiresWrittenAnswers: app.requiresWrittenAnswers ?? false,
                isSponsored: app.isSponsored ?? undefined,
            };
            console.log('Converted application:');
            console.dir(convertedApp, { depth: null });
            return convertedApp;
        });

        console.log(`Conversion complete. Returning ${convertedApplications.length} applications`);
        return convertedApplications;
    } catch (error) {
        console.error('Error fetching applications from database:', error);
        console.dir(error, { depth: null });
        throw error;
    }
}
console.log('Applications route set up successfully')
export default applicationsRoute

