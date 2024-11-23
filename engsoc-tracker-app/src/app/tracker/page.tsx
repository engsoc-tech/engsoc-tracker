

import Image from "next/image"
import { Check, X, UserCircle, Instagram, Globe, Linkedin, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from "react"
import { formatDistanceToNowStrict, parseISO, addDays, format, differenceInDays } from 'date-fns'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import ApplicationTable from '@/components/ui/ApplicationTable'
import CardsCarousel from "@/components/ui/CardsCarousel"

import { Button } from "@/components/ui/button"
import { applications } from "@/lib/mock-data"
import Link from "next/link"
import { CardProps } from "@/components/ui/interfaces"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ButtonScrollsToRef from "@/components/ui/goToTrackerButton"
import GoToTrackerBtn from "@/components/ui/goToTrackerButton"
import Faqs from "@/components/ui/faq"

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



// function isSimpleCard(card: CardProps): card is SimpleCard { //Removed as per update 3
//   return 'bgColor' in card;
// }

const cards: CardProps[] = [ // Updated from mockCards to cards
  {
    bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    mainTitle: "Follow the Warwick Engineering Society",
    subtitle: "Stay updated with our latest events and opportunities",
    link: "https://warwick.ac.uk/fac/sci/eng/",
    textColour: "text-white",
    linkText: "Follow Us" // Updated to include linkText
  },
  {
    bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    mainTitle: "Upcoming Events",
    subtitle: "Join us for our next networking event on 25th November 2024!",
    link: "https://warwick.ac.uk/fac/sci/eng/events/",
    textColour: "text-white",
    linkText: "View Events" // Updated to include linkText
  },
  {
    bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    mainTitle: "Engineering Careers Fair",
    subtitle: "Meet top employers and explore career opportunities",
    link: "https://warwick.ac.uk/fac/sci/eng/careers/",
    textColour: "text-white",
    linkText: "Learn More" // Updated to include linkText
  },
]


const developers = [
  { name: "Developer 1", link: "https://media.licdn.com/dms/image/v2/D4E03AQFGV_qKseoGkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729184073149?e=1737590400&v=beta&t=yELowMAMCezNDfqnfDJFWbXNxbN9bLyTuv7A5WQeGsg" },
  { name: "Ege Cavus", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" },
]

export default function TrackingPage() {

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 ">
        <div className="bg-[#111111] p-6 rounded-b-xl">
          <section className="aboveTheTracker  text-white pt-2 pb-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center ">
              <img className="brightness-90" src="https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/9a0457f5-7b28-4756-af5c-bc8dd7759cd6/engsoc+logo.png?format=2500w" width={200} alt="Warwick Engienering Society" />
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-100 text-center">The #1 Application Tracker For Engineering Students</h2>
              <div className="space-y-4 mb-8 flex flex-col items-center">
                <article className="text-gray-300 font-normal leading-relaxed text-center ">
                  The Engineering Application Tracker is a comprehensive tool designed to help students at the University of Warwick manage their engineering internship and job applications. It provides a centralized platform to track application deadlines, requirements, and progress across various companies and roles.
                </article>
                <GoToTrackerBtn />
              </div>
              <Faqs />
            </div>
          </section>
          <section className="aboveTheTracker mb-4 text-white ">
            <div className="max-w-4xl mx-auto ">
              <CardsCarousel cards={cards} />
            </div>
          </section>
        </div>

        <div className="mt-8 p-6" id="mainArea">
          <ApplicationTable applications={applications} />
        </div>
      </main>
      <footer className="bg-zinc-900 text-white py-8 px-6 pb-32  gap-4">
        <div className=" w-full">
          <div className="flex flex-col w-full md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/EngsocLogoClipped-wBa6lqurjwfK2y2PTfpVrkJY2hn5dt.png"
                alt="Warwick Engineering Society Logo"
                width={50}
                height={50}
                className="aspect-square"
              />
              <div>
                <h2 className="text-lg font-semibold">Warwick Engineering Society</h2>
                <p className="text-sm text-gray-400">Bridging Academia and Industry</p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end w-full space-y-2">
              <Button variant="default" asChild className="h-9 px-4 py-2">
                <Link
                  href="https://www.warwickengineers.co.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-0"
                >
                  Visit our website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-400">© {new Date().getFullYear()} Warwick Engineering Society</p>
                <Link
                  href="https://buildwithtye.com/portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Made by Tye Goulder
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
