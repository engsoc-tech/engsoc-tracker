import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

import { ApplicationSchema } from '@/schemas/applications'
import { rateLimit } from '@/middleware/rateLimit'
import prisma from '@/db/prisma'
import { convertType } from '@/lib/utils'


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
        const applications = await fetchApplications(limit, offset)
        console.log(`Fetched ${applications.length} applications`)

        const validatedApplications = z.array(ApplicationSchema).parse(applications)
        console.log('Applications data validated successfully')

        return c.json({
            success: true,
            data: validatedApplications
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors)
            return c.json({ success: false, error: 'The internal applications schema didnt match the ApplicationSchema type. (Are you using incorrectly generated mock data?)' }, 400)
        }
        console.error('Error fetching applications:', error)
        return c.json({ success: false, error: 'Internal server error' }, 500)
    }
})

async function fetchApplications(limit: number, offset: number): Promise<z.infer<typeof ApplicationSchema>[]> {
    try {
        const applications = await prisma.application.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                closeDate: 'asc'
            }
        });

        // Convert casing
        const convertedApplications = applications.map(app => ({
            ...app,
            type: convertType(app.type),
            requiresCv: app.requiresCv ?? false,
            requiresCoverLetter: app.requiresCoverLetter ?? false,
            requiresWrittenAnswers: app.requiresWrittenAnswers ?? false,
            isSponsored: app.isSponsored ?? undefined,
        }))


        return convertedApplications
    } catch (error) {
        console.error('Error fetching applications from database:', error)
        throw error
    }
}

console.log('Applications route set up successfully')
export default applicationsRoute

