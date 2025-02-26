"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { type PositionType, EngineeringType } from "@prisma/client"
import { toast } from "@/hooks/use-toast"
import { submitApplicationAction } from "../../app/tracker/actions"

export function ContributeApplicationModal() {
    const [open, setOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [formData, setFormData] = useState({
        programme: "",
        company: "",
        type: "Internship" as PositionType,
        engineering: [] as EngineeringType[],
        openDate: "",
        closeDate: "",
        requiresCv: false,
        requiresCoverLetter: false,
        requiresWrittenAnswers: false,
        notes: "",
        link: "",
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target
        if (type === "date") {
            const date = new Date(value)
            const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
            setFormData((prev) => ({ ...prev, [name]: formattedDate }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? e.target.checked : value,
            }))
        }
    }

    const handleEngineeringChange = (value: EngineeringType) => {
        setFormData((prev) => ({
            ...prev,
            engineering: prev.engineering.includes(value)
                ? prev.engineering.filter((item) => item !== value)
                : [...prev.engineering, value],
        }))
    }

    const handleSubmit = async () => {
        try {
            const submissionData = {
                ...formData,
                openDate: new Date(formData.openDate.split("/").reverse().join("-")),
                closeDate: new Date(formData.closeDate.split("/").reverse().join("-")),
            }
            const res = await submitApplicationAction(submissionData)
            if (!res || !res.data) {
                throw new Error("Something went wrong while submitting the application, please try again later (NORES)")
            }
            const result = res.data
            if ("success" in result) {
                setOpen(false)
                setConfirmOpen(true)
                toast({
                    title: "Success",
                    description: "Application submitted for review",
                })
            } else {
                throw new Error("Something went wrong while submitting the application, please try again later")
            }
        } catch (error) {
            console.error("Error submitting application:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "An error occurred while submitting the application",
                variant: "destructive",
            })
        }
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="p-2 hover:bg-gray-100">
                        <Plus className="h-6 w-6 text-black" />
                        Contribute an Application
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Application</DialogTitle>
                        <DialogDescription>
                            Enter the details of the new application. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="programme" className="text-right">
                                Programme
                            </Label>
                            <Input
                                id="programme"
                                name="programme"
                                value={formData.programme}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">
                                Company
                            </Label>
                            <Input
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select
                                name="type"
                                value={formData.type}
                                onValueChange={(value: PositionType) => setFormData((prev) => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select position type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                    <SelectItem value="Placement">Placement</SelectItem>
                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Engineering</Label>
                            <div className="col-span-3 flex flex-wrap gap-2">
                                {Object.values(EngineeringType).map((type) => (
                                    <div key={type} className="flex items-center">
                                        <Checkbox
                                            id={`engineering-${type}`}
                                            checked={formData.engineering.includes(type)}
                                            onCheckedChange={() => handleEngineeringChange(type)}
                                        />
                                        <Label htmlFor={`engineering-${type}`} className="ml-2">
                                            {type}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="openDate" className="text-right">
                                Open Date
                            </Label>
                            <Input
                                id="openDate"
                                name="openDate"
                                type="date"
                                value={
                                    formData.openDate
                                        ? new Date(formData.openDate.split("/").reverse().join("-")).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="closeDate" className="text-right">
                                Close Date
                            </Label>
                            <Input
                                id="closeDate"
                                name="closeDate"
                                type="date"
                                value={
                                    formData.closeDate
                                        ? new Date(formData.closeDate.split("/").reverse().join("-")).toISOString().split("T")[0]
                                        : ""
                                }
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Requirements</Label>
                            <div className="col-span-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresCv"
                                        name="requiresCv"
                                        checked={formData.requiresCv}
                                        onCheckedChange={(checked: boolean) => setFormData((prev) => ({ ...prev, requiresCv: checked }))}
                                    />
                                    <Label htmlFor="requiresCv">CV</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresCoverLetter"
                                        name="requiresCoverLetter"
                                        checked={formData.requiresCoverLetter}
                                        onCheckedChange={(checked: boolean) =>
                                            setFormData((prev) => ({ ...prev, requiresCoverLetter: checked }))
                                        }
                                    />
                                    <Label htmlFor="requiresCoverLetter">Cover Letter</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="requiresWrittenAnswers"
                                        name="requiresWrittenAnswers"
                                        checked={formData.requiresWrittenAnswers}
                                        onCheckedChange={(checked: boolean) =>
                                            setFormData((prev) => ({ ...prev, requiresWrittenAnswers: checked }))
                                        }
                                    />
                                    <Label htmlFor="requiresWrittenAnswers">Written Answers</Label>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Input
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link
                            </Label>
                            <Input id="link" name="link" value={formData.link} onChange={handleInputChange} className="col-span-3" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" onClick={handleSubmit}>
                            Save application
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Application Submitted</DialogTitle>
                        <DialogDescription>
                            Thank you, your application has been submitted for review by the EngSoc team.
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setConfirmOpen(false)}>Close</Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

