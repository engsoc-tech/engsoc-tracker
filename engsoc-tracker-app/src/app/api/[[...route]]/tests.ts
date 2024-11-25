import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rateLimit } from '@/middleware/rateLimit'
import { CardSchema } from '@/schemas/cards'
import { mockCards } from '@/lib/mock-data'
import { ModifiedApplicationSchema } from '@/schemas/applications'
import { scrapeGradcracker, scrapeGradcrackerDiscipline } from '@/core/gradcracker'

console.log('Initializing cards route')

const testsRoute = new Hono()


testsRoute.get('/gradcracker', zValidator('query', z.object({
    discipline: z.string().optional(),

})), async (c) => {
    console.log('Received GET request for test route')
    const { discipline,
    } = c.req.valid('query')


    try {

        const scraped = await scrapeGradcrackerDiscipline('aerospace')
        return c.json({
            success: true,
            data: scraped
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors)
            return c.json({ success: false, error: 'The internal applications schema didnt match the ModifiedApplicationSchema type. (Are you using incorrectly generated mock data?)' }, 400)
        }
        console.error('Error testing applications:', error)
        return c.json({ success: false, error: 'Internal server error' }, 500)
    }
})




console.log('Tests route set up successfully')

export default testsRoute

