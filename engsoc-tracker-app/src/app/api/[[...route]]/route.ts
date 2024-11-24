import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import applicationsRoute from './applications'
import cardsRoute from './cards'
import testsRoute from './tests'
import cron from 'node-cron'
import { runScrapeJob } from '@/core/main'

const app = new Hono().basePath('/api')
    .route('/applications', applicationsRoute)
    .route('/cards', cardsRoute)
    .route('/tests', testsRoute)
// Schedule the scraping job to run daily at 1:00 AM
cron.schedule('0 1 * * *', () => {
    console.log('Running scheduled scrape job...');
    runScrapeJob();
});
export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
