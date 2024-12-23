import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import CardsRoute from './cards'
import CronRoute from './cron'
import ApplicationsRoute from './applications'

const app = new Hono().basePath('/api')
    .route('/cards', CardsRoute)
    .route('/cron', CronRoute)
    .route('/applications', ApplicationsRoute)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
