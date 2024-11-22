"use client"

import { useState } from 'react'
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
import { UserCircle } from 'lucide-react'

export default function SettingsModal() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2 hover:bg-gray-100">
                    <UserCircle className="h-6 w-6 text-black" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>User Settings</DialogTitle>
                    <DialogDescription>
                        Adjust your profile settings here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value="John Doe" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" value="john.doe@example.com" className="col-span-3" />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" onClick={() => setOpen(false)}>Save changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}