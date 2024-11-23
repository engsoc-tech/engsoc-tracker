import { z } from 'zod'

export const CardSchema = z.object({
    bgImage: z.string().url({
        message: "Background image must be a valid URL"
    }),
    mainTitle: z.string().min(1, {
        message: "Main title is required"
    }),
    subtitle: z.string().min(1, {
        message: "Subtitle is required"
    }),
    link: z.string().url({
        message: "Link must be a valid URL"
    }),
    textColour: z.string().regex(/^text-/, {
        message: "Text colour must be a valid Tailwind text color class"
    }),
    linkText: z.string().min(1, {
        message: "Link text is required"
    })
})

export type CardType = z.infer<typeof CardSchema>