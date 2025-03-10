import { saveApplicationToDatabaseAndScrambleName } from "@/core/main";
import { performPostCheck } from "@/core/postChecks";
import { ApplicationType } from "@/schemas/applications";

export async function saveAndSramble(application: ApplicationType): Promise<ApplicationType> {
    //save and scramble
    console.log("SAVING AND SCRAMBLING")
    await saveApplicationToDatabaseAndScrambleName(application);
    return application;
}