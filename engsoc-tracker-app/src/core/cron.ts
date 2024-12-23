import { saveResultsToDB } from "@/data-access/applications";
import { pullNewApplications } from "@/lib/pull-applications";


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
    console.log('Initializing cron job...');
    if (isInitialized) {
        return "Cron job already initialized or initializing. Exiting..."
    }

    console.log('Running initial scrape job...');
    isRunning = true;
    try {
        await runCronJob();

    } catch (error) {
        console.error('Error in initial scrape job:', error);
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
    return "Cron job initialized successfully";
}
export async function runCronJob() {
    if (isRunning) {
        console.log('Cron job is already running');
        return;
    }

    console.log('Running pullNewApplications job');
    isRunning = true;
    try {
        const results = await pullNewApplications();
        console.log(`Retrieved ${results.length} results`);

        console.log('Saving results to database');
        await saveResultsToDB(results);
        console.log('Results saved successfully');

        console.log('pullNewApplications job completed successfully');
    } catch (error) {
        console.error('Error in pullNewApplications job:', error);
    } finally {
        isRunning = false;
    }
}

export function stopCronJob() {
    if (!isInitialized || !intervalId) {
        return "Cron job is not initialized or interval doesn't exist."
    } else {
        try {
            clearTimeout(intervalId);
            intervalId = null;
            isInitialized = false;
            return "Cron job stopped successfully";
        } catch (e) {
            return `Error stopping cron job: ${e instanceof Error ? e.message : String(e)}`;
        }
    }
}

export function getCronStatus() {
    console.log(`Current status - isRunning: ${isRunning}, isInitialized: ${isInitialized}`);
    return { isInitialized, isRunning }
}

console.log('Cron route setup complete');