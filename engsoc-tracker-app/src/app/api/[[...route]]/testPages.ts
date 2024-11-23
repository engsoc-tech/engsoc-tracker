import { Hono } from 'hono'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

const testPageRoute = new Hono()

// Define the ApplicationSchema
const ApplicationSchema = z.object({
    id: z.string(),
    programme: z.string(),
    company: z.string(),
    type: z.enum(['Internship', 'Placement', 'Graduate']),
    engineering: z.string(),
    salary: z.string().optional(),
    location: z.string().optional(),
    openDate: z.string().datetime(),
    closeDate: z.string().datetime(),
    requiresCv: z.boolean(),
    requiresCoverLetter: z.boolean(),
    requiresWrittenAnswers: z.boolean(),
    isSponsored: z.boolean().optional(),
    notes: z.string().optional(),
    link: z.string().url(),
})

type ApplicationType = z.infer<typeof ApplicationSchema>

// Function to generate a random application
function generateRandomApplication(): ApplicationType {
    const company = faker.company.name()
    const programme = faker.name.jobTitle()
    const id = `${company}-${programme}`.replace(/\s+/g, '-').toLowerCase()
    const openDate = faker.date.past()
    const closeDate = faker.date.future()

    return {
        id,
        programme,
        company,
        type: faker.helpers.arrayElement(['Internship', 'Placement', 'Graduate']),
        engineering: faker.name.jobArea(),
        salary: faker.helpers.maybe(() => `£${faker.number.int({ min: 20000, max: 50000 })} per annum`),
        location: faker.address.city(),
        openDate: openDate.toISOString(),
        closeDate: closeDate.toISOString(),
        requiresCv: faker.datatype.boolean(),
        requiresCoverLetter: faker.datatype.boolean(),
        requiresWrittenAnswers: faker.datatype.boolean(),
        isSponsored: faker.helpers.maybe(() => faker.datatype.boolean()),
        notes: faker.helpers.maybe(() => faker.lorem.sentence()),
        link: faker.internet.url(),
    }
}

// Route to generate and return mock opportunities
testPageRoute.get('/gradcracker', (c) => {
    console.log('Generating mock Gradcracker opportunities')

    const count = 100 // Number of opportunities to generate
    const opportunities: ApplicationType[] = []

    for (let i = 0; i < count; i++) {
        opportunities.push(generateRandomApplication())
    }

    console.log(`Generated ${opportunities.length} mock opportunities`)

    return c.json({
        success: true,
        count: opportunities.length,
        data: opportunities
    })
})

export default testPageRoute

