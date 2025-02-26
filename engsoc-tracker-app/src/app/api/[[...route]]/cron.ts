
import { Hono } from 'hono'
import { initializeCronJob, stopCronJob } from '@/core/cron';
import { env } from '@/env';
import { getCronStatus } from '@/core/cron/status';

console.log('Initializing cron route...');

const cronRoute = new Hono()
cronRoute.use('*', async (c, next) => {
    const secret = c.req.query('secret');
    if (secret !== env.CRON_SECRET) {
        return c.json({ success: false, message: 'Unauthorized' }, 401)
    }
    await next();
})
cronRoute.get('/', async (c) => {
    console.log('Received request to start cron job');
    await initializeCronJob();
    console.log('Cron job initialization completed');
    return c.json(getCronStatus());
});

cronRoute.get('/status', async (c) => {
    console.log('Received request for cron job status');
    try {
        return c.json(getCronStatus());
    } catch (e) {
        return c.json({
            success: false,
            error: e
        })
    }
});
cronRoute.get('/stop', async (c) => {
    console.log('Received request to stop cron job');
    try {
        stopCronJob()
        return c.json({
            success: true
        })
    } catch (e) {
        return c.json({ success: false, error: e })
    }
})

console.log('Cron route setup complete');

export default cronRoute