import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import applicationsRoute from './applications'
import cardsRoute from './cards'
import testsRoute from './tests'
import cron from 'node-cron'
import cronRoute from './cron'
import { runScrapeJob } from '@/core/main'

const app = new Hono().basePath('/api')
    .route('/applications', applicationsRoute)
    .route('/cards', cardsRoute)
    .route('/tests', testsRoute)
    .route('/cron', cronRoute)
export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
