import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rateLimit } from '@/middleware/rateLimit'
import { CardSchema } from '@/schemas/cards'
import { mockCards } from '@/lib/mock-data'
import { ModifiedApplicationSchema } from '@/schemas/applications'
import { scrapeGradcracker } from '@/core/gradcracker'

console.log('Initializing cards route')

const testsRoute = new Hono()


testsRoute.get('/', zValidator('query', z.object({
    _limit: z.string().optional().default("10"),
    _offset: z.string().optional().default("0")
})), async (c) => {
    console.log('Received GET request for applications')
    const { _limit, _offset } = c.req.valid('query')
    const limit = parseInt(_limit)
    const offset = parseInt(_offset)
    console.log(`Fetching applications with limit: ${limit}, offset: ${offset}`)

    try {
        const scraped = await scrapeGradcracker('aerospace')
        console.log(`Fetched ${scraped.length} applications`)
        return c.json({
            success: true,
            data: scraped
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




console.log('Tests route set up successfully')

export default testsRoute

