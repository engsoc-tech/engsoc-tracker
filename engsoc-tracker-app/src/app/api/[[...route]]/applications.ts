import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'

import { z } from 'zod'
import { ApplicationSchema } from '@/schemas/ApplicationSchema'
import { rateLimit } from '@/middleware/rateLimit'

const app = new Hono()

app.use('*', rateLimit({ limit: 100, period: 60000 })) // 100 requests per minute

app.get('/', zValidator('query', z.object({
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0)
})), async (c) => {
    const { limit, offset } = c.req.valid('query')

    try {
        // Here you would typically fetch data from your database
        const applications = await fetchApplications(limit, offset)

        const validatedApplications = z.array(ApplicationSchema).parse(applications)

        return c.json({
            success: true,
            data: validatedApplications
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return c.json({ success: false, error: 'Invalid data format' }, 400)
        }
        console.error('Error fetching applications:', error)
        return c.json({ success: false, error: 'Internal server error' }, 500)
    }
})

// Mock function to simulate database query
async function fetchApplications(limit: number, offset: number) {
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockApplications.slice(offset, offset + limit)
}

// Mock data (replace with actual database queries in production)
const mockApplications = [
    {
        id: '1',
        programme: 'Summer Internship',
        company: 'Tech Corp',
        type: 'Internship',
        engineering: 'Software',
        openDate: '2024-01-01T00:00:00Z',
        closeDate: '2024-03-31T23:59:59Z',
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        notes: 'Apply early for best consideration',
        link: 'https://example.com/apply'
    },
    // Add more mock applications as needed
]

export default app

