'use server'

import prisma from "@/db/prisma";

export async function migrateDatabase(): Promise<void> {
    await prisma.appConfig.updateMany({
        data:
        {
            maxInEachDiscipline: 2,
            maxInEachType: 2
        }
    })
    console.log("Migration complete")
    // const apps = await prisma.application.findMany();
    // for (const app of apps) {
    //     await prisma.application.update({
    //         where: { id: app.id },
    //         data: {
    //             origProgramme: app.programme
    //         }
    //     })
    // }
}