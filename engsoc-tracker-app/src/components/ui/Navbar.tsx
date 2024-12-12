'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Link, UserCircle } from 'lucide-react'
import SettingsModal from "./userSettings"

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    console.log("isScrolled", isScrolled)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                console.log("scrolled")
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 select-none transition-colors duration-300 ${!isScrolled ? 'bg-background' : 'bg-[#111111] border-b border-white border-opacity-15 text-white'}`}>
            <div className="flex items-center gap-4">
                <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9331-gDQGoR7Tnp4hNM4QssFkA6C138cCQX.png"
                    alt="Warwick Engineering Society Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                />
                <h2 className="text-lg font-normal">Engineering Application Tracker</h2>
            </div>
            <SettingsModal />
        </header>
    )
}
