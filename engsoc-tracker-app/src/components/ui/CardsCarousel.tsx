"use client"

import { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import useEmblaCarousel from "embla-carousel-react"
import { Skeleton } from "./skeleton"
import { CardProps } from "./interfaces"
import { Button } from "./button"
import { mockCards } from "@/lib/mock-data"



export default function CardsCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [isLoading, setIsLoading] = useState(true);
    const [cards, setCards] = useState<CardProps[]>([])

    useEffect(() => {
        if (emblaApi) {
            const intervalId = setInterval(() => {
                console.log("Scrolling to next slide")
                emblaApi.scrollNext()
            }, 10000)

            return () => clearInterval(intervalId)
        }
    }, [emblaApi])
    useEffect(() => {
        const fetchData = async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setCards(mockCards)
            setIsLoading(false);
        };
        fetchData();
    }, []);
    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {isLoading ? (
                    // Skeleton loading for cards
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex-[0_0_100%]">
                            <Card className="bg-[#202020] border-none rounded-xl">
                                <CardContent className="flex items-center justify-center p-6">
                                    <div className="text-center w-full">
                                        <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
                                        <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
                                        <div className="flex justify-center space-x-4">
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                ) : (
                    cards.map((card, index) => (
                        <a href={card.link} target="_blank" rel="noopener noreferrer" key={index} className="flex-[0_0_100%]">
                            <Card
                                className={`${card.bgColor || ''} ${card.textColour || ''} relative overflow-hidden shasdow-sm rounded-xl border-none  filter grayscale`}
                                style={card.bgImage ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${card.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                            >
                                <CardContent className="flex items-center justify-center p-6 relative z-10">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold mb-4">{card.mainTitle}</h2>
                                        <p className="mb-4">{card.subtitle}</p>
                                        {card.linkText && <Button className="text-white " variant={'link'}>{card.linkText} ↗</Button>}
                                    </div>
                                </CardContent>
                                {card.bgImage && <div className="absolute inset-0 bg-black opacity-50"></div>}
                            </Card>
                        </a>
                    ))
                )}
            </div>
        </div>
    )
}