import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import applicationsRoute from './applications'
import cardsRoute from './cards'

const app = new Hono().basePath('/api')
    .route('/applications', applicationsRoute)
    .route('/cards', cardsRoute)

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
