import { formatDistanceToNowStrict, parseISO, addDays, format, differenceInDays } from 'date-fns'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatDate = (date: string) => {
    const today = new Date()
    const parsedDate = parseISO(date)
    const daysFromNow = differenceInDays(parsedDate, today)

    if (daysFromNow <= 30) {
        return `in ${daysFromNow} days`
    } else {
        return format(parsedDate, 'dd/MM/yyyy')
    }
}