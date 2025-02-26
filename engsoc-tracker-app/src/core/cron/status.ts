import prisma from "@/db/prisma";

export async function getCronStatus() {
    const cfg = await prisma.appConfig.findFirst();
    return cfg?.shouldKeepUpdating;
}

export async function setCronStatus(status: boolean) {
    await prisma.appConfig.update({
        where: { id: "config" },
        data: { shouldKeepUpdating: status },
    });
}
export async function getLastUpdated() {
    const cfg = await prisma.appConfig.findFirst();
    return cfg?.lastUpdated;
}

export async function setLastUpdated(date: Date) {
    await prisma.appConfig.update({
        where: { id: "config" },
        data: { lastUpdated: date },
    });
}