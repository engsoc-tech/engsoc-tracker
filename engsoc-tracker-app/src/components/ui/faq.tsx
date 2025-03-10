import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { Separator } from './separator';
type Props = {}
const developers: Developer[] = [
    {
        name: "Tye Goulder",

        link: "tye.jpg",
        linkedinUrl: "https://www.linkedin.com/in/tye-goulder/",
        websiteUrl: "https://buildwithtye.com",
        roleInProject: "Developer",
        roleInEngSoc: "Vice-President"
    },

    // { name: "Ege Cavus", roleInProject: 'Project Supervisor', roleInEngSoc: 'Technology Officer', link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" }
];
type Developer = {
    name: string;
    link: string;
    roleInProject: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    roleInEngSoc: string;
}
const societyMembers = [

    { name: "Darina Mollova", link: "darina.jpg" },
    { name: "Lily Hayes", link: "lily.jpg" },
    { name: "Jash Navati", link: "jash.jpg" },
    { name: "Mihir Annapureddy", link: "mihir.jpg" },
    { name: "Karam Sandhar", link: "karam.jpg" },
    { name: "Ege Cavus", link: "ege.jpg" },
    { name: "Tye Goulder", link: "tye.jpg" },

]
const accordionContent = [
    {
        title: "What is the Warwick Engineering Society?",
        content: (
            <>
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-100 mb-4">About us</h4>
                </div>
                <div className="flex gap-12">
                    <p className="text-white font-light leading-relaxed mb-4" id="mainArea">
                        The Warwick Engineering Society (EngSoc) is a student-run organization at the University of Warwick. We&apos;re bridging the gap between academia and industry, providing our members with valuable resources, networking opportunities, and events to enhance their engineering careers.
                    </p>
                    <div className="shrink-0">
                        <SocietyMembersProfilePictures members={societyMembers} />
                    </div>
                </div>
                <div className="mt-4" >
                    <h4 className="text-lg font-semibold text-gray-100 mb-4 mt-2" >Tracker developed by:</h4>
                    <DeveloperProfilePictures developers={developers} />
                </div>
            </>
        ),
    },
];
function Faqs({ }: Props) {
    return (
        <div className="bg-neutral-900/90 p-4 rounded-xl w-full">
            <Accordion
                defaultValue='item-1'
                type="single" collapsible className="w-full [&_[data-radix-accordion-content]]:!pb-4">
                {accordionContent.map((item, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index + 1}`}
                        className={`${index > 0 ? "border-t border-white/10" : ""} ${index === accordionContent.length - 1 ? "border-b-0" : ""}`}
                    >
                        <AccordionTrigger>{item.title}</AccordionTrigger>
                        <AccordionContent>{item.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}
function DeveloperProfilePictures({ developers }: { developers: Developer[] }) {
    return (
        <div className="grid grid-cols-2 gap-4" >
            {developers.map((developer, index) => (
                <div key={index} className='flex justify-between w-full'>
                    <div key={index} className="flex items-center space-x-4 mb-4">
                        <img
                            src={developer.link}
                            alt={developer.name}
                            width={50}
                            height={50}
                            className="rounded-full  object-cover aspect-square border-2 border-black/50"
                        />
                        <div>
                            <h5 className="text-md font-semibold text-gray-100">{developer.name}</h5>
                            <p className="text-gray-300 text-sm">{developer.roleInProject}, {developer.roleInEngSoc}</p>
                        </div>
                    </div>
                    {index !== developers.length - 1 && <Separator className='h-auto opacity-10' orientation='vertical' />}
                </div>
            ))}

        </div>
    )
}
function SocietyMembersProfilePictures({ members }: { members: { name: string, link: string }[] }) {
    return (
        <div className="flex -space-x-4 mb-4">
            {societyMembers.map((member, index) => (
                <img
                    key={index}
                    src={member.link}
                    alt={member.name}
                    width={50}
                    height={50}
                    className="rounded-full aspect-square brightness-75 border-2 border-white"
                    style={{ zIndex: societyMembers.length - index }}
                />
            ))}
        </div>
    )
}
export default Faqs