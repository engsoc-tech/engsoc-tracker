import { addDays } from 'date-fns'
import { PositionType } from '../schemas/applications'
import { CardProps } from '@/components/ui/interfaces'

const today = new Date()

export const mockCards: CardProps[] = [
    {
        bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        mainTitle: "Follow the Warwick Engineering Society",
        subtitle: "Stay updated with our latest events and opportunities",
        link: "https://warwick.ac.uk/fac/sci/eng/",
        textColour: "text-white",
        linkText: "Follow Us"
    },
    {
        bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        mainTitle: "Upcoming Events",
        subtitle: "Join us for our next networking event on 25th November 2024!",
        link: "https://warwick.ac.uk/fac/sci/eng/events/",
        textColour: "text-white",
        linkText: "View Events"
    },
    {
        bgImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        mainTitle: "Engineering Careers Fair",
        subtitle: "Meet top employers and explore career opportunities",
        link: "https://warwick.ac.uk/fac/sci/eng/careers/",
        textColour: "text-white",
        linkText: "Learn More"
    },
]

export const mockApplications: PositionType[] = [
    {
        programme: "Graduate Engineer",
        company: "Rolls-Royce",
        type: "Graduate",
        engineering: ["Mechanical"],
        openDate: addDays(today, 2),
        closeDate: addDays(today, 15),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "Online assessment required",
        link: "https://careers.rolls-royce.com/",
    },
    {
        programme: "Summer Internship",
        company: "Arup",
        type: "Internship",
        engineering: ["Civil"],
        openDate: addDays(today, 1),
        closeDate: addDays(today, 5),
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Portfolio recommended",
        link: "https://www.arup.com/careers",
    },
    {
        programme: "Industrial Placement",
        company: "Jaguar Land Rover",
        type: "Placement",
        engineering: ["Mechanical", "Electronic"],
        openDate: addDays(today, 3),
        closeDate: addDays(today, 10),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        isSponsored: true,
        notes: "12-month placement",
        link: "https://www.jaguarlandrovercareers.com/",
    },
    {
        programme: "Software Engineering Intern",
        company: "IBM",
        type: "Internship",
        engineering: ["Software", "Computing"],
        openDate: addDays(today, 1),
        closeDate: addDays(today, 7),
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Coding challenge required",
        link: "https://www.ibm.com/uk-en/employment/",
    },
    {
        programme: "Graduate Scheme",
        company: "BAE Systems",
        type: "Graduate",
        engineering: ["Aerospace", "Electronic"],
        openDate: addDays(today, 4),
        closeDate: addDays(today, 28),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "Security clearance required",
        link: "https://www.baesystems.com/en/careers",
    },
    {
        programme: "Year in Industry",
        company: "Siemens",
        type: "Placement",
        engineering: ["Electronic", "Software"],
        openDate: addDays(today, 3),
        closeDate: addDays(today, 8),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        isSponsored: true,
        notes: "German language skills preferred",
        link: "https://new.siemens.com/uk/en/company/jobs.html",
    },
    {
        programme: "Research Internship",
        company: "University of Warwick",
        type: "Internship",
        engineering: ["Chemical", "Computing"],
        openDate: addDays(today, 5),
        closeDate: addDays(today, 14),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Lab experience required",
        link: "https://warwick.ac.uk/fac/sci/eng/",
    },
    {
        programme: "Graduate Development Programme",
        company: "National Grid",
        type: "Graduate",
        engineering: ["Electronic", "Civil"],
        openDate: addDays(today, 7),
        closeDate: addDays(today, 18),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "Multiple rotations across UK",
        link: "https://careers.nationalgrid.com/",
    },
    {
        programme: "Robotics Engineering Intern",
        company: "Boston Dynamics",
        type: "Internship",
        engineering: ["Mechanical", "Software"],
        openDate: addDays(today, 4),
        closeDate: addDays(today, 17),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Experience with ROS preferred",
        link: "https://www.bostondynamics.com/careers",
    },
    {
        programme: "Environmental Engineering Graduate",
        company: "Atkins",
        type: "Graduate",
        engineering: ["Civil", "Chemical"],
        openDate: addDays(today, 6),
        closeDate: addDays(today, 23),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        isSponsored: true,
        notes: "Sustainability focus",
        link: "https://careers.snclavalin.com/",
    },
    {
        programme: "Chemical Process Engineer",
        company: "Shell",
        type: "Graduate",
        engineering: ["Chemical"],
        openDate: addDays(today, 8),
        closeDate: addDays(today, 27),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "HAZOP experience beneficial",
        link: "https://www.shell.com/careers",
    },
    {
        programme: "Aerospace Systems Intern",
        company: "Airbus",
        type: "Internship",
        engineering: ["Aerospace", "Electronic"],
        openDate: addDays(today, 10),
        closeDate: addDays(today, 30),
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Avionics knowledge preferred",
        link: "https://www.airbus.com/careers",
    },
    {
        programme: "Nuclear Engineering Placement",
        company: "EDF Energy",
        type: "Placement",
        engineering: ["Mechanical", "Electronic"],
        openDate: addDays(today, 12),
        closeDate: addDays(today, 33),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "18-month placement opportunity",
        link: "https://www.edfenergy.com/careers",
    },
    {
        programme: "Biomedical Device Innovation",
        company: "Medtronic",
        type: "Graduate",
        engineering: ["Electronic", "Software"],
        openDate: addDays(today, 13),
        closeDate: addDays(today, 37),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        isSponsored: true,
        notes: "FDA regulation knowledge a plus",
        link: "https://www.medtronic.com/uk-en/about/careers.html",
    },
    {
        programme: "Automotive Design Intern",
        company: "McLaren Automotive",
        type: "Internship",
        engineering: ["Mechanical", "Software"],
        openDate: addDays(today, 15),
        closeDate: addDays(today, 40),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "CAD proficiency required",
        link: "https://careers.mclaren.com/",
    },
    {
        programme: "Structural Engineering Intern",
        company: "Mott MacDonald",
        type: "Internship",
        engineering: ["Civil"],
        openDate: addDays(today, 17),
        closeDate: addDays(today, 43),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: false,
        isSponsored: true,
        notes: "Experience with AutoCAD preferred",
        link: "https://www.mottmac.com/careers",
    },
    {
        programme: "Renewable Energy Graduate Scheme",
        company: "Ørsted",
        type: "Graduate",
        engineering: ["Electronic", "Mechanical"],
        openDate: addDays(today, 18),
        closeDate: addDays(today, 47),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "Focus on offshore wind energy",
        link: "https://orsted.com/en/careers",
    },
    {
        programme: "Robotics and Automation Placement",
        company: "ABB",
        type: "Placement",
        engineering: ["Mechanical", "Software"],
        openDate: addDays(today, 20),
        closeDate: addDays(today, 50),
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Programming skills required",
        link: "https://global.abb/group/en/careers",
    },
    {
        programme: "Aerospace Systems Engineer",
        company: "Leonardo",
        type: "Graduate",
        engineering: ["Aerospace", "Electronic"],
        openDate: addDays(today, 22),
        closeDate: addDays(today, 53),
        requiresCv: true,
        requiresCoverLetter: true,
        requiresWrittenAnswers: true,
        isSponsored: true,
        notes: "Security clearance may be required",
        link: "https://www.leonardo.com/en/careers",
    },
    {
        programme: "Materials Science Internship",
        company: "Johnson Matthey",
        type: "Internship",
        engineering: ["Chemical", "Mechanical"],
        openDate: addDays(today, 23),
        closeDate: addDays(today, 57),
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: true,
        isSponsored: false,
        notes: "Lab-based role",
        link: "https://matthey.com/en/careers",
    },
]

