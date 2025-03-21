import { createEnv } from '@t3-oss/env-nextjs';

import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.string().optional(),
        EMAIL_FROM: z.string(),
        // EMAIL_SERVER_PASSWORD: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1),
        APP_URL: z.string().min(1),
        CRON_SECRET: z.string().min(1),
    },
    client: {
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        EMAIL_FROM: process.env.EMAIL_FROM,
        // EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
        APP_URL: process.env.APP_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        CRON_SECRET: process.env.CRON_SECRET,
    },
});
