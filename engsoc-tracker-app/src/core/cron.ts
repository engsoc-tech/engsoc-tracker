
import { runScrapeJob } from '../core/main'
import { getCronStatus } from './cron/status';

console.log('Initializing cron route...');

let isInitialized = false;
let isRunning = false;
let intervalId: NodeJS.Timeout | null = null;

function getMillisecondsUntilNextRun() {
    const now = new Date();
    const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0, 0);
    return nextRun.getTime() - now.getTime();
}

export async function initializeCronJob() {
    const shouldKeepUpdating = await getCronStatus();
    if (shouldKeepUpdating) {
        console.log('Cron job already initialized. Exiting...');
        return;
    }
    console.log('Initializing cron job...');
    try {
        await runScrapeJob();
        console.log('Initial scrape job completed');
    } catch (error) {
        console.error('Error in scrape job:', error);
        throw error; // Rethrow to prevent initialization on error
    } finally {
        isRunning = false;
    }

    console.log('--Scheduling daily cron job...');
    const scheduleNextRun = () => {
        const msUntilNextRun = getMillisecondsUntilNextRun();
        console.log(`Scheduling next run in ${msUntilNextRun} ms`);
        intervalId = setTimeout(async () => {
            // await runCronJob();
            scheduleNextRun(); // Schedule the next run after completion
        }, msUntilNextRun);
    };

    scheduleNextRun();

    isInitialized = true;
    console.log('Cron job fully initialized');
}

async function runCronJob() {
    console.log('Attempting to run cron job at:', new Date().toISOString());
    if (isRunning) {
        console.log('Cron job is already running. Exiting...');
        return;
    }
    console.log('Starting scrape job...');
    isRunning = true;
    try {
        await runScrapeJob();
        console.log('Scrape job completed successfully');
    } catch (error) {
        console.error('Error occurred during scrape job:', error);
    } finally {
        isRunning = false;
    }
}

export function stopCronJob() {
    if (!isInitialized || !intervalId) {
        console.error("Cron job is not initialized or interval doesn't exist.");
        return;
    } else {
        try {
            clearTimeout(intervalId);
            intervalId = null;
            isInitialized = false;
            console.log("Cron job stopped successfully.");
        } catch (e) {
            console.error("Error stopping cron job: " + e);
        }
    }
}

console.log('Cron route setup complete');