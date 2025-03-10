'use server'
import { env } from '@/env';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
export async function scrambleNameWithAI(name: string): Promise<string> {
    console.log("SCRAMBLE CALLED, THIS IS COSTLY")
    const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `Change the programme name ${name} so it retains the same info but says in different way, say the result only. Keep it short.`,
            },
        ],
    });
    if (res) {
        return res.choices[0].message.content?.replace(/\.$/, '')
            //replace the an ending period with nothjing

            || "Error";
    } else {
        return name;
    }
}