import { initializeCronJob, stopCronJob, getCronStatus } from '@/core/cron';
import { Hono } from 'hono'
import { env } from '@/env'

const cronRoute = new Hono()

// cronRoute.use('*', async (c, next) => {
//   const authHeader = c.req.header('authorization')
//   if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
//     return c.json({ error: 'Unauthorized' }, 401)
//   }
//   await next()
// })

cronRoute.get('/', async (c) => {
    const action = c.req.query('action')

    switch (action) {
        case 'run':
            console.log('Received request to start cron job')
            const outcome = await initializeCronJob()
            return c.json({ message: outcome, ...getCronStatus() })

        case 'status':
            console.log('Received request for cron job status')
            try {
                return c.json(getCronStatus())
            } catch (e) {
                return c.json({
                    success: false,
                    error: e instanceof Error ? e.message : String(e)
                }, 500)
            }

        case 'stop':
            console.log('Received request to stop cron job')
            try {
                const outcome = stopCronJob()
                return c.json({
                    success: true,
                    message: outcome
                })
            } catch (e) {
                return c.json({
                    success: false,
                    error: e instanceof Error ? e.message : String(e)
                }, 500)
            }

        default:
            return c.json({ error: 'Invalid action' }, 400)
    }
})

export default cronRoute

