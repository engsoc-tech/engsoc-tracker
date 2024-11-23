import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SocietyMember {
    name: string
    link: string
}

interface SocietyMembersTooltipProps {
    societyMembers: SocietyMember[]
}

const SocietyMembersTooltip: React.FC<SocietyMembersTooltipProps> = ({ societyMembers }) => {
    return (
        <TooltipProvider>
            {societyMembers.map((member, index) => (
                <Tooltip key={index}>
                    <TooltipTrigger asChild>
                        <motion.div
                            whileHover={{ y: -5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Image
                                src={member.link}
                                alt={member.name}
                                width={50}
                                height={50}
                                className="rounded-full aspect-square border-2 border-white cursor-pointer"
                                style={{ zIndex: societyMembers.length - index }}
                            />
                        </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{member.name}</p>
                    </TooltipContent>
                </Tooltip>
            ))}
        </TooltipProvider>

    )
}

export default SocietyMembersTooltip