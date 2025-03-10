import { ApplicationType } from "@/schemas/applications";
import { scrambleNameWithAI } from "./openai/openai";

export async function performPostCheck(application: ApplicationType): Promise<ApplicationType> {
    console.log('Starting post-checks on applications...')
    let newApplication: ApplicationType;
    const newProgramme = await scrambleNameWithAI(application.programme);
    newApplication = { ...application, programme: newProgramme };

    console.log('Post-checks completed. Returning filtered application...')
    return newApplication;
}