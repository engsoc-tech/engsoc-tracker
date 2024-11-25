import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import applicationsRoute from './applications'
import cardsRoute from './cards'
import testsRoute from './tests'
import cron from 'node-cron'
import cronRoute from './cron'
import { runScrapeJob } from '@/core/main'
import prisma from '@/db/prisma'
import deleteRoute from './devOnly'

const app = new Hono().basePath('/api')
    .route('/applications', applicationsRoute)
    .route('/cards', cardsRoute)
    .route('/tests', testsRoute)
    .route('/cron', cronRoute)
    .route('/deleteApps', deleteRoute)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
