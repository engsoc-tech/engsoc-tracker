'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { UserCircle } from 'lucide-react'
import { ContributeApplicationModal } from './contributeApplicationModal'
import { LoginModal } from './LoginModal'
import { getCurrentUser } from '@/lib/session'
import { User } from 'lucia'
import { Button } from './button'
import { toast } from '@/hooks/use-toast'
import { logout } from '@/app/server-actions/users'
import Link from 'next/link'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    console.log("isScrolled", isScrolled);
    const handleLogout = async () => {
        toast({ description: "Logging out...", variant: 'default' });
        const res = await logout({});
        const result = res?.data;
        if (result && "failure" in result) {
            toast({ description: result.failure, variant: 'destructive' });
        } else {
            setLoginDialogOpen(false);
        }
    };
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
    useEffect(() => {
        async function main() {
            const u = await getCurrentUser();
            if (u) {
                setUser(u)
            }
        }
        main()
    }
        , [])

    return (
        <header className={`sticky top-0 z-20 flex items-center justify-between border-b px-6 py-4 select-none transition-colors duration-300 ${!isScrolled ? 'bg-background' : 'bg-[#111111] border-b border-white border-opacity-15 text-white'}`}>
            <Link href="/" className="flex items-center gap-4">
                <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_9331-gDQGoR7Tnp4hNM4QssFkA6C138cCQX.png"
                    alt="Warwick Engineering Society Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12"
                />
                <h2 className="text-lg font-normal">Engineering Application Tracker</h2>
            </Link>

            <div className="flex items-center gap-4">
                {
                    user && (user.role == "SUPER" || user.role == "ADMIN") ? (
                        <Link href="/admin">
                            <Button variant="outline">Admin</Button>
                        </Link>
                    ) : null
                }
                {user ? (
                    <>
                        <ContributeApplicationModal />
                        <Button variant="outline" onClick={handleLogout}>
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <LoginModal>
                        <Button variant="outline">Sign In</Button>
                    </LoginModal>
                )}
            </div>
        </header>
    )
}
