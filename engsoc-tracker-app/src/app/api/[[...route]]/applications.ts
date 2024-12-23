import { Hono } from 'hono'
import {
    getApplicationsFromDB,
    createApplication,
    updateApplication,
    deleteApplication
} from '@/data-access/applications'
import { pullNewApplications } from '@/lib/pull-applications'

const applicationsRoute = new Hono()

applicationsRoute.get('/', async (c) => {
    try {
        const limit = parseInt(c.req.query('limit') || '10', 10)
        const offset = parseInt(c.req.query('offset') || '0', 10)

        if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
            return c.json({ error: 'Invalid limit or offset parameters' }, 400)
        }

        // const { applications, totalCount } = await getApplicationsFromDB(limit, offset)
        const applications = await pullNewApplications();

        return c.json({
            applications,
            pagination: {
                // total: totalCount,
                total: 10,
                limit,
                offset,
                // hasMore: offset + limit < totalCount
                hasMore: offset + limit < 10
            }
        })
    } catch (error) {
        console.error('Error fetching applications:', error)
        return c.json({ error: 'Failed to fetch applications' }, 500)
    }
})

applicationsRoute.post('/', async (c) => {
    try {
        const body = await c.req.json()
        const newApplication = await createApplication(body)
        return c.json(newApplication, 201)
    } catch (error) {
        console.error('Error creating application:', error)
        return c.json({ error: 'Failed to create application' }, 500)
    }
})

applicationsRoute.put('/:id', async (c) => {
    const id = c.req.param('id')
    try {
        const body = await c.req.json()
        const updatedApplication = await updateApplication(id, body)
        if (!updatedApplication) {
            return c.json({ error: 'Application not found' }, 404)
        }
        return c.json(updatedApplication)
    } catch (error) {
        console.error('Error updating application:', error)
        return c.json({ error: 'Failed to update application' }, 500)
    }
})

applicationsRoute.delete('/:id', async (c) => {
    const id = c.req.param('id')
    try {
        const deletedApplication = await deleteApplication(id)
        if (!deletedApplication) {
            return c.json({ error: 'Application not found' }, 404)
        }
        return c.json({ message: 'Application deleted successfully' })
    } catch (error) {
        console.error('Error deleting application:', error)
        return c.json({ error: 'Failed to delete application' }, 500)
    }
})

export default applicationsRoute

