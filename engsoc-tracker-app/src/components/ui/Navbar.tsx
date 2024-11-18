import Image from "next/image"
import { UserCircle } from 'lucide-react'

export function Navbar() {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 bg-background">
            <div className="flex items-center gap-4">
                <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9331-gDQGoR7Tnp4hNM4QssFkA6C138cCQX.png"
                    alt="Warwick Engineering Society Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                />
                <h1 className="text-xl font-semibold">Engineering Applications Tracker</h1>
            </div>
            <button className="rounded-full p-2 hover:bg-gray-100" onClick={() => alert("Opened user profile!")}>
                <UserCircle className="h-6 w-6 text-black" />
            </button>
        </header>
    )
}