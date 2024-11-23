import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

type Props = {}
const developers = [
    {
        name: "Tye Goulder",
        link: "https://media.licdn.com/dms/image/v2/D4E03AQFGV_qKseoGkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729184073149?e=1737590400&v=beta&t=yELowMAMCezNDfqnfDJFWbXNxbN9bLyTuv7A5WQeGsg",
        linkedinUrl: "https://www.linkedin.com/in/tye-goulder/",
        websiteUrl: "https://www.tyegoulder.com/",
        roleInProject: "Lead Developer",
        roleInEngSoc: "Tech Representitive"
    },
    { name: "Developer 2", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" }
];
const societyMembers = [
    { name: "Darina Mollova", link: "https://www.linkedin.com/in/darina-mollova-52881a197/" },
    { name: "Lily Hayes", link: "https://www.linkedin.com/in/hayes-lily/" },
    { name: "Jash Navati", link: "https://www.linkedin.com/in/jashnanavati/" },
    { name: "Mihir Annapureddy", link: "https://www.linkedin.com/in/mihir-annapureddy-18a567215/" },
    { name: "Karam Sandhar", link: "https://www.linkedin.com/in/karam-sandhar/" },
    { name: "Society Member", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" }
]
const accordionContent = [
    {
        title: "What is the Warwick Engineering Society?",
        content: (
            <>
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">About us</h4>
                    <div className="flex -space-x-4 mb-4">
                        {societyMembers.map((member, index) => (
                            <img
                                key={index}
                                src={member.link}
                                alt={member.name}
                                width={50}
                                height={50}
                                className="rounded-full aspect-square border-2 border-white"
                                style={{ zIndex: societyMembers.length - index }}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                    The Warwick Engineering Society (EngSoc) is a student-run organization at the University of Warwick. We aim to bridge the gap between academia and industry, providing our members with valuable resources, networking opportunities, and events to enhance their engineering careers.
                </p>
                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-100 mb-2">Developed by:</h4>
                    {developers.map((developer, index) => (
                        <div key={index} className="flex items-center space-x-4 mb-4">
                            <img
                                src={developer.link}
                                alt={developer.name}
                                width={60}
                                height={60}
                                className="rounded-full object-cover aspect-square border-2 border-white"
                            />
                            <div>
                                <h5 className="text-md font-semibold text-gray-100">{developer.name}</h5>
                                <p className="text-gray-300 text-sm">{developer.roleInProject}, {developer.roleInEngSoc} in EngSoc</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        ),
    },
    // {
    //     title: "Who are EngSoc?",
    //     content: (
    //         <div className="flex -space-x-4">
    //             {societyMembers.map((member, index) => (
    //                 <img
    //                     key={index}
    //                     src={member.link}
    //                     alt={member.name}
    //                     width={50}
    //                     height={50}
    //                     className="rounded-full border-2 border-white"
    //                     style={{ zIndex: societyMembers.length - index }}
    //                 />
    //             ))}
    //         </div>
    //     ),
    // },
];
function Faqs({ }: Props) {
    return (
        <div className="bg-neutral-900/90 p-4 rounded-xl w-full">
            <Accordion type="single" collapsible className="w-full [&_[data-radix-accordion-content]]:!pb-4">
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

export default Faqs