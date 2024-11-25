"use client"

import React, { useState, useMemo, useEffect } from "react"
import { formatDistanceToNowStrict, parseISO, format, differenceInDays, isAfter } from 'date-fns'
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
import { ApplicationType } from "@/schemas/applications"
import { EngineeringType } from "@prisma/client"
import { EngineeringTypes, SelectableEngineeringType, SelectableEngineeringTypes, SelectablePositonType } from "@/core/map"
import { EngineeringTypeType } from "../../../prisma/generated/zod"
import { PositionType } from "../../schemas/applications"




export default function ApplicationTable({ }) {
    const selectableTypes = [...EngineeringTypes, "all"];
    const [selectedType, setSelectedType] = useState<SelectablePositonType>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [applications, setApplications] = useState<ApplicationType[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedEngineering, setSelectedEngineering] = useState<SelectableEngineeringType>("all")
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const itemsPerPage = 5
    useEffect(() => {
        //begins the periodic scrape job if it's not already running 
        fetch('/api/cron');
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/applications?_limit=10&_offset=0')
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
        console.log('Recalculating filteredApplications')
        console.log('Current filters:', { selectedType, selectedEngineering })
        const filtered = applications.filter(
            (app) => {
                console.log("app type lowercase", app.type.toLowerCase(), "selected type lowercase", selectedType.toLowerCase())
                const typeMatch = (selectedType === "all" || app.type.toLowerCase() === selectedType.toLowerCase())
                const engineeringMatch = selectedEngineering === "all" || app.engineering.includes(selectedEngineering as EngineeringType)
                const currentDate = new Date()
                const dateValid = isAfter(app.closeDate, currentDate)
                console.log("datevalid", dateValid)
                console.log('Application filter results:', { app, typeMatch, dateValid })
                return typeMatch && dateValid && engineeringMatch
            }
        );
        console.log('Filtered applications count:', filtered.length)
        return filtered;
    }, [selectedType, selectedEngineering, applications]);


    console.log('Starting to group applications')
    const groupedApplications = filteredApplications.reduce((acc, app) => {
        console.log('Grouping application:', app)
        app.engineering.forEach(eng => {
            if (eng === selectedEngineering || selectedEngineering === "all") {
                if (!acc[eng]) {
                    console.log('Creating new group for engineering type:', eng)
                    acc[eng] = []
                }
                acc[eng].push(app)
                console.log('Added application to group:', eng)
            }
        })
        return acc
    }, {} as Record<string, ApplicationType[]>)
    console.log('Grouped applications result:', Object.keys(groupedApplications).map(key => `${key}: ${groupedApplications[key].length} items`))

    const totalPages = Math.ceil(Object.keys(groupedApplications).length / itemsPerPage)

    const paginatedApplications = Object.fromEntries(
        Object.entries(groupedApplications).slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        )
    )

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
        <Table className="shadow-sm relative" >
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
                        <React.Fragment key={engineering + apps.toString()}>
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
                                        <Badge className={`${getDeadlineStatus(app.closeDate instanceof Date ? app.closeDate.toISOString() : app.closeDate)} cursor-pointer`}>
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
        <div className="flex flex-col justify-between h-full" >

            <Tabs defaultValue="all" className="p-4 h-full" onValueChange={newVal => { setSelectedType(newVal as SelectablePositonType) }}>

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
                                        {SelectableEngineeringTypes.map((type) => (
                                            <CommandItem
                                                key={type[0]}
                                                value={type}
                                                onSelect={(currentValue) => {
                                                    setSelectedEngineering(currentValue === selectedEngineering ? "all" : currentValue as SelectableEngineeringType)
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
                <TabsContent value="all" className="mt-4" >
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
                <span className="text-opacity-50">
                    {Object.keys(groupedApplications).length === 0
                        ? "No results for this type - try another filter!"
                        : `Page ${currentPage} of ${totalPages}`}
                </span>
                <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}