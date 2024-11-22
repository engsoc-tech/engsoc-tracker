

import Image from "next/image"
import { Check, X, UserCircle, Instagram, Globe, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from "react"
import { formatDistanceToNowStrict, parseISO, addDays, format, differenceInDays } from 'date-fns'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ApplicationTable from '@/components/ui/ApplicationTable'
import CardsCarousel from "@/components/ui/CardsCarousel"

import { Button } from "@/components/ui/button"
import { applications } from "@/lib/mock-data"
import Link from "next/link"

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


// function isSimpleCard(card: CardProps): card is SimpleCard { //Removed as per update 3
//   return 'bgColor' in card;
// }

const mockCards: CardProps[] = [ //Updated as per update 4
  {
    bgColor: "bg-blue-100",
    mainTitle: "Follow the Warwick Engineering Society",
    subtitle: "Stay updated with our latest events and opportunities",
    link: "https://warwick.ac.uk/fac/sci/eng/",
  },
  {
    bgColor: "bg-green-100",
    mainTitle: "Upcoming Career Fair",
    subtitle: "Join us for our annual Engineering Career Fair on November 30th, 2024.",
    link: "#",
  },
  {
    bgColor: "bg-yellow-100",
    mainTitle: "New Internship Opportunities",
    subtitle: "Check out the latest summer internships from top engineering firms",
    link: "/internships",
  },
]

const societyMembers = [
  { name: "Darina Mollova", link: "https://www.linkedin.com/in/darina-mollova-52881a197/" },
  { name: "Lily Hayes", link: "https://www.linkedin.com/in/hayes-lily/" },
  { name: "Jash Navati", link: "https://www.linkedin.com/in/jashnanavati/" },
  { name: "Mihir Annapureddy", link: "https://www.linkedin.com/in/mihir-annapureddy-18a567215/" },
  { name: "Karam Sandhar", link: "https://www.linkedin.com/in/karam-sandhar/" },
  { name: "Unknown Member", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" },
]

const developers = [
  { name: "Developer 1", link: "https://media.licdn.com/dms/image/v2/D4E03AQFGV_qKseoGkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729184073149?e=1737590400&v=beta&t=yELowMAMCezNDfqnfDJFWbXNxbN9bLyTuv7A5WQeGsg" },
  { name: "Developer 2", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" },
]

export default function TrackingPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6">
        <div>
          <CardsCarousel cards={mockCards} />
        </div>
        <div className="mb-8"></div>
        <div>
          <ApplicationTable applications={applications} />
        </div>
      </main>
      <footer className="bg-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">About the Engineering Tracker</h2>
          <p className="mb-4">
            The Engineering Tracker is a comprehensive tool designed to help students at the University of Warwick
            keep track of various engineering opportunities, including internships, placements, and graduate schemes.
            It provides up-to-date information on application deadlines, requirements, and direct links to apply.
          </p>
          <h3 className="text-xl font-semibold mb-2">About Warwick Engineering Society</h3>
          <div className="flex items-center mb-4">
            <div className="flex -space-x-4 mr-4">
              {societyMembers.map((member, index) => (
                <img
                  key={index}
                  src={member.link}
                  alt={member.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                  style={{ zIndex: societyMembers.length - index }}
                />
              ))}
            </div>
            <p className="flex-1">
              The Warwick Engineering Society is a student-run organization dedicated to supporting and enhancing
              the experience of engineering students at the University of Warwick. We organize various events,
              workshops, and initiatives to help our members develop both professionally and personally.
            </p>
          </div>
          <h3 className="text-xl font-semibold mb-2">Developers of the Tracker</h3>
          <div className="flex items-center">
            <div className="flex space-x-2 mr-4">
              {developers.map((dev, index) => (
                <img
                  key={index}
                  src={dev.link}
                  alt={dev.name}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
            <p className="flex-1">
              This Engineering Tracker was developed by a team of passionate student developers from the
              Warwick Engineering Society. Their goal was to create a user-friendly tool that simplifies
              the job search process for their fellow engineering students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
