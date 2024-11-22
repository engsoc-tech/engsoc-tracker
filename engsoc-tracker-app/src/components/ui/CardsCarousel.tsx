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

type CardProps = {
    bgColor: string
    mainTitle: string
    subtitle: string
    link: string
}


export default function CardsCarousel({ cards }: { cards: CardProps[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (emblaApi) {
            const intervalId = setInterval(() => {
                emblaApi.scrollNext()
            }, 10000)

            return () => clearInterval(intervalId)
        }
    }, [emblaApi])
    useEffect(() => {
        const fetchData = async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsLoading(false);
        };

        fetchData();
    }, []);
    return (
        <div className="w-full mb-8 overflow-hidden" ref={emblaRef}>
            <Carousel>
                <CarouselContent>
                    {
                        isLoading ? (
                            // Skeleton loading for cards
                            Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <Card>
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
                                </CarouselItem>
                            ))
                        ) : (
                            cards.map((card, index) => (
                                <CarouselItem key={index}>
                                    <Card className={card.bgColor}>
                                        <CardContent className="flex items-center justify-center p-6">
                                            <div className="text-center">
                                                <h2 className="text-2xl font-bold mb-4">{card.mainTitle}</h2>
                                                <p className="mb-4">{card.subtitle}</p>
                                                <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                    Learn More
                                                </a>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}