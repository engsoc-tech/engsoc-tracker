import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { rateLimit } from '@/middleware/rateLimit'
import { CardSchema } from '@/schemas/cards'
import { mockCards } from '@/lib/mock-data'

console.log('Initializing cards route')

const cardsRoute = new Hono()

cardsRoute.use('*', rateLimit({ limit: 100, period: 60000 })) // 100 requests per minute

cardsRoute.get('/', zValidator('query', z.object({
    limit: z.number().optional().default(5),
    offset: z.number().optional().default(0)
})), async (c) => {
    console.log('Received GET request for cards')
    const { limit, offset } = c.req.valid('query')
    console.log(`Fetching cards with limit: ${limit}, offset: ${offset}`)

    try {
        const cards = await fetchCards(limit, offset)
        console.log(`Fetched ${cards.length} cards`)

        const validatedCards = z.array(CardSchema).parse(cards)
        console.log('Cards data validated successfully')

        return c.json({
            success: true,
            data: validatedCards
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors)
            return c.json({ success: false, error: 'Invalid data format' }, 400)
        }
        console.error('Error fetching cards:', error)
        return c.json({ success: false, error: 'Internal server error' }, 500)
    }
})

async function fetchCards(limit: number, offset: number) {
    console.log(`Simulating database query for cards (limit: ${limit}, offset: ${offset})`)
    await new Promise(resolve => setTimeout(resolve, 100))
    return mockCards.slice(offset, offset + limit)
}


console.log('Cards route set up successfully')

export default cardsRoute

