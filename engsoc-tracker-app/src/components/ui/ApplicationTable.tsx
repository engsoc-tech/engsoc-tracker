"use client"

import React, { useState, useMemo, useEffect } from "react"
import { formatDistanceToNowStrict, parseISO, format, differenceInDays } from 'date-fns'
import { Check, X, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { cn, formatDate } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { mockApplications } from "@/lib/mock-data"
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


const getDeadlineStatus = (closeDate: string) => {
    const now = new Date('2024-11-17')
    const deadline = parseISO(closeDate)
    const daysUntilDeadline = differenceInDays(deadline, now)

    if (daysUntilDeadline < 14) {
        return "bg-red-500 text-white hover:bg-opacity-80 hover:bg-red-500 transition-colors"
    } else if (daysUntilDeadline < 31) {
        return "bg-orange-500 text-white hover:bg-opacity-80 hover:bg-orange-500 transition-colors"
    } else {
        return "bg-green-500 text-white hover:bg-opacity-80 hover:bg-green-500 transition-colors"
    }
}


export default function ApplicationTable({ }) {
    const [selectedType, setSelectedType] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [applications, setApplications] = useState<Application[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEngineering, setSelectedEngineering] = useState("all")
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const engineeringTypes = ["all", ...new Set(applications.map(app => app.engineering))]
    const itemsPerPage = 5
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/applications')
                if (!response.ok) {
                    throw new Error('Failed to fetch applications')
                }
                const data = await response.json()
                setApplications(data.data)
            } catch (error) {
                console.error('Error fetching applications:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredApplications = useMemo(() => {
        return applications.filter(
            (app) =>
                (selectedType === "all" || app.type.toLowerCase() === selectedType.toLowerCase()) &&
                (selectedEngineering === "all" || app.engineering === selectedEngineering)
        );
    }, [selectedType, selectedEngineering, applications]);

    const groupedApplications = filteredApplications.reduce((acc, app) => {
        if (!acc[app.engineering]) {
            acc[app.engineering] = []
        }
        acc[app.engineering].push(app)
        return acc
    }, {} as Record<string, Application[]>)

    const totalPages = Math.ceil(Object.keys(groupedApplications).length / itemsPerPage)

    const paginatedApplications = Object.fromEntries(
        Object.entries(groupedApplications).slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    )
    const renderSkeletonRow = () => (
        <TableRow>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-8" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        </TableRow>
    )


    const renderApplicationTable = () => (
        <Table className="shadow-sm relative">
            <TableHeader className="sticky top-0  z-10">
                <TableRow className="
              

                ">
                    <TableHead>Programme</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="hidden md:table-cell">Opening Date</TableHead>
                    <TableHead>Closing Date</TableHead>
                    <TableHead className="hidden sm:table-cell">CV</TableHead>
                    <TableHead className="hidden sm:table-cell">Cover Letter</TableHead>
                    <TableHead className="hidden sm:table-cell">Written Answers</TableHead>
                    <TableHead className="hidden lg:table-cell">Notes</TableHead>
                    <TableHead>Link</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <React.Fragment key={index}>
                            {index % 2 === 0 && (
                                <TableRow>
                                    <TableCell colSpan={9} className="bg-muted">
                                        <Skeleton className="h-4 w-1/4" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {renderSkeletonRow()}
                        </React.Fragment>
                    ))
                ) : (
                    Object.entries(paginatedApplications).map(([engineering, apps]) => (
                        <React.Fragment key={engineering}>
                            <TableRow>
                                <TableCell colSpan={9} className="bg-black/80 text-white font-bold">
                                    {engineering} Engineering
                                </TableCell>
                            </TableRow>
                            {apps.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.programme}</TableCell>
                                    <TableCell>{app.company}</TableCell>
                                    <TableCell className="hidden md:table-cell opacity-80">{
                                        format(new Date(app.openDate), 'dd/MM/yyyy')
                                    }</TableCell>
                                    <TableCell>
                                        <Badge className={`${getDeadlineStatus(app.closeDate)} cursor-pointer`}>
                                            {formatDate(app.closeDate)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {app.requiresCv ? (
                                            <Check className="h-4 w-4 text-black" />
                                        ) : (
                                            <X className="h-4 w-4 text-black" />
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {app.requiresCoverLetter ? (
                                            <Check className="h-4 w-4 text-black" />
                                        ) : (
                                            <X className="h-4 w-4 text-black" />
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {app.requiresWrittenAnswers ? (
                                            <Check className="h-4 w-4 text-black" />
                                        ) : (
                                            <X className="h-4 w-4 text-black" />
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                                        {app.notes}
                                    </TableCell>
                                    <TableCell>
                                        <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Apply
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </React.Fragment>
                    ))
                )}
            </TableBody>
        </Table>
    )

    return (
        <>

            <Tabs defaultValue="all" className="p-4" onValueChange={setSelectedType}>

                <div className="flex flex-col items-center md:flex-row gap-4 mx-4 mb-6">

                    <Popover open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                // aria-expanded={open}
                                className="flex-2 min-w-[300px] justify-between"
                            >
                                {selectedEngineering === "all"
                                    ? "All Engineering"
                                    : `${selectedEngineering} Engineering`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandList>
                                    <CommandInput placeholder="Filter by type..." />
                                    <CommandEmpty>No engineering type found.</CommandEmpty>
                                    <CommandGroup>
                                        {engineeringTypes.map((type) => (
                                            <CommandItem
                                                key={type}
                                                value={type}
                                                onSelect={(currentValue) => {
                                                    setSelectedEngineering(currentValue === selectedEngineering ? "all" : currentValue)
                                                    setCurrentPage(1)
                                                    setSearchDialogOpen(false)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedEngineering === type ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {type === "all" ? "All Engineering" : `${type} Engineering`}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <TabsList className="flex flex-col sm:flex-row h-min flex-3 w-full grid-cols-4 bg-muted">
                        <TabsTrigger className="flex-1 w-full" value="all">All</TabsTrigger>
                        <TabsTrigger className="flex-1 w-full" value="internship">Internships</TabsTrigger>
                        <TabsTrigger className="flex-1 w-full" value="placement">Placements</TabsTrigger>
                        <TabsTrigger className="flex-1 w-full" value="graduate">Graduate Schemes</TabsTrigger>
                    </TabsList>

                </div>
                <TabsContent value="all" className="mt-4">
                    {renderApplicationTable()}
                </TabsContent>
                <TabsContent value="internship" className="mt-4">
                    {renderApplicationTable()}
                </TabsContent>
                <TabsContent value="placement" className="mt-4">
                    {renderApplicationTable()}
                </TabsContent>
                <TabsContent value="graduate" className="mt-4">
                    {renderApplicationTable()}
                </TabsContent>
            </Tabs>
            <div className="flex justify-between items-center mt-4 p-4">
                <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
    )
}