
import Image from "next/image"
import { Link, UserCircle } from 'lucide-react'
import SettingsModal from "./userSettings"

export function Navbar() {
    return (
        <header className="sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 bg-background">
            <div className="flex items-center gap-4">
                <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9331-gDQGoR7Tnp4hNM4QssFkA6C138cCQX.png"
                    alt="Warwick Engineering Society Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                />
                <h2 className="font-semibold">Engineering Application Tracker</h2>
            </div>
            <SettingsModal />
        </header>
    )
}