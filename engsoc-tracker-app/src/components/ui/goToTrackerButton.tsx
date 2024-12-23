'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './button'


function GoToTrackerBtn() {
    const [mainAreaRef, setMainAreaRef] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const mainArea = document.getElementById('mainArea');
        if (mainArea) {
            setMainAreaRef(mainArea);
        } else {
            console.warn('Main area element not found');
        }
    }, [])

    const scrollToMainArea = useCallback(() => {
        if (mainAreaRef) {
            mainAreaRef.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.warn('Main area ref is not set');
        }
    }, [mainAreaRef])
    return (
        <Button variant={'outline'} className={`w-full md:w-auto hover:underline bg-[#111111] hover:bg-white/5 hover:text-white`} onClick={scrollToMainArea}>
            Go to Tracker
        </Button>
    )
}

export default GoToTrackerBtn