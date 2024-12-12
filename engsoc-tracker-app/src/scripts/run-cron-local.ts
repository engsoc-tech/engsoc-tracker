import { initializeCronJob } from "../core/cron";

async function runCronLocally() {
    try {
        initializeCronJob();
    } catch (error) {
        console.error('Error running cron job:', error);
    }
}

runCronLocally();

