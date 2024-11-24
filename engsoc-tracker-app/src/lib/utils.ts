import { ModifiedApplicationType } from "@/schemas/applications";
import { clsx, type ClassValue } from "clsx"
import { differenceInDays, format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string) => {
  const today = new Date();

  const parsedDate = parseISO(date)
  const daysFromNow = differenceInDays(parsedDate, today)

  if (daysFromNow <= 30) {
    return `in ${daysFromNow} days`
  } else {
    return format(parsedDate, 'dd/MM/yyyy')
  }
}

export function convertType(type: string): ModifiedApplicationType['type'] {
  switch (type.toUpperCase()) {
    case 'INTERNSHIP':
      return 'Internship'
    case 'PLACEMENT':
      return 'Placement'
    case 'GRADUATE':
      return 'Graduate'
    default:
      throw new Error(`Invalid application type: ${type}`)
  }
}