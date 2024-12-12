import { PositionType } from "@/schemas/applications";
import { clsx, type ClassValue } from "clsx"
import { differenceInDays, format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  if (date.getFullYear() === 9999) {
    return 'Ongoing'
  }

  const today = new Date();
  const daysFromNow = differenceInDays(date, today)

  if (daysFromNow <= 30) {
    return `in ${daysFromNow} days`
  } else {
    return format(date, 'dd/MM/yyyy')
  }
}


