


import { ExternalLink } from 'lucide-react'
import ApplicationTable from '@/components/ui/ApplicationTable'
import CardsCarousel from "@/components/ui/CardsCarousel"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CardProps } from "@/components/ui/interfaces"
import GoToTrackerBtn from "@/components/ui/goToTrackerButton"
import Faqs from "@/components/ui/faq"


export default function TrackingPage() {
  console.log("Standup version - see globals.css")
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 ">
        <div className="bg-[#111111] p-6 rounded-b-xl">
          <section className="aboveTheTracker  text-white pt-2 pb-8">
            <div className="max-w-4xl mx-auto flex flex-col items-center pt-4">
              <img className="brightness-90 object-scale-down" src="EngsocLogoClipped.png" width={100} alt="Warwick Engienering Society" />
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-100 text-center">Welcome to the Warwick Engineering Careers Tracker</h2>
              <div className="space-y-4 mb-8 flex flex-col items-center">
                <article className="text-gray-300 font-normal leading-relaxed text-center ">
                  The Engineering Application Tracker is a comprehensive tool designed to help students at the University of Warwick manage their engineering internship and job applications. It provides a centralized platform to track application deadlines, requirements, and progress across various companies and roles. <br /> <span className='opacity-40'> Made by Tye Goulder</span>
                </article>
                <div className="flex gap-4">
                  <Button variant="secondary" asChild className="h-9 px-4 py-2">
                    <Link
                      href="https://www.warwickengineers.co.uk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-0"
                    >
                      Submit an application ↗
                    </Link>
                  </Button>
                  <GoToTrackerBtn />
                </div>
              </div>
              {/* <Faqs /> */}
            </div>
          </section>
        </div>

        <div className="mt-8 p-6 min-h-96" >
          <ApplicationTable />
        </div>
        <section className="aboveTheTracker mb-4 text-white ">
          <div className="max-w-4xl mx-auto ">
            <CardsCarousel />
          </div>
        </section>
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
