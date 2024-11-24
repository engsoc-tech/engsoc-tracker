import cron from 'node-cron';
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

import { ModifiedApplicationSchema } from '@/schemas/applications'
import { rateLimit } from '@/middleware/rateLimit'
import prisma from '@/db/prisma'
import { convertType } from '@/lib/utils'
import { runScrapeJob } from '@/core/main'


const cronRoute = new Hono()
let isInitialized = false;
// cronRoute.use('*', rateLimit({ limit: 100, period: 60000 })) // 100 requests per minute
let ch: cron.ScheduledTask;
cronRoute.use('*', rateLimit({ limit: 1, period: 60000 })) // 1  requests per minute
cronRoute.get('/', async (c) => {
    initializeCronJob()
})
async function runCronJob() {
    console.log('Running cron job at:', new Date().toISOString());
    runScrapeJob();
    // Schedule the scraping job to run daily at 1:00 AM
    ch = cron.schedule('0 1 * * *', () => {
        console.log('Running scheduled scrape job...');
        runScrapeJob();
    });
}
function initializeCronJob() {
    if (isInitialized) return;

    // Run immediately when the application starts
    runScrapeJob();

    // Schedule to run every day at 1 AM
    cron.schedule('0 1 * * *', runCronJob);

    isInitialized = true;
    console.log('Cron job initialized');
}
cronRoute.get('/stop', async (c) => {
    ch.stop();
})
export default cronRoute