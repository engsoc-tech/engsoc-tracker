import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import applicationsRoute from './applications'
import cardsRoute from './cards'
import testPagesRoute from './testPages'

const app = new Hono().basePath('/api')
    .route('/applications', applicationsRoute)
    .route('/cards', cardsRoute)
    .route('/testing', testPagesRoute)  // Add this line

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app
