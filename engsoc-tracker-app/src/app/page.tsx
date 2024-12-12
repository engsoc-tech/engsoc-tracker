'use server'
import { redirect } from "next/navigation"


interface Application {
  id: string
  programme: string
  company: string
  type: string
  engineering: string
  openDate: string
  closeDate: string
  requiresCv: boolean
  requiresCoverLetter: boolean
  requiresWrittenAnswers: boolean
  notes?: string
  link: string
}

// interface CustomCard { //Removed as per update 1
//   content: React.ReactNode
// }

type CardProps = { //Updated as per update 2
  bgColor: string
  mainTitle: string
  subtitle: string
  link: string
}

const today = new Date('2024-11-17')



export default async function TrackingPage() {
  redirect("/tracker")
}
