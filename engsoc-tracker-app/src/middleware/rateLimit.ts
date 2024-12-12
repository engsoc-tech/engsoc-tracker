import { Context, Next } from 'hono'

interface RateLimitOptions {
    limit: number
    period: number
}

export function rateLimit(options: RateLimitOptions) {
    const requests = new Map<string, number[]>()

    return async (c: Context, next: Next) => {
        const ip = c.req.header('x-forwarded-for') || 'unknown'
        const now = Date.now()
        const requestTimes = requests.get(ip) || []

        // Remove old requests
        const recentRequests = requestTimes.filter(time => now - time < options.period)

        if (recentRequests.length >= options.limit) {
            return c.json({ error: 'Too many requests' }, 429)
        }

        recentRequests.push(now)
        requests.set(ip, recentRequests)

        await next()
    }
}

