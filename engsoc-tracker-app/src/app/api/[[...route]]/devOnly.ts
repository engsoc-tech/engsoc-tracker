import prisma from "@/db/prisma"
import { Hono } from "hono"

const deleteRoute = new Hono()


deleteRoute.get('/', async (c) => {
    // await prisma.application.deleteMany()
    return c.json({ success: false })
});

export default deleteRoute;