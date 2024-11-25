import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import { Separator } from './separator';
type Props = {}
const developers: Developer[] = [
    {
        name: "Tye Goulder",
        link: "https://media.licdn.com/dms/image/v2/D4E03AQFGV_qKseoGkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729184073149?e=1737590400&v=beta&t=yELowMAMCezNDfqnfDJFWbXNxbN9bLyTuv7A5WQeGsg",
        linkedinUrl: "https://www.linkedin.com/in/tye-goulder/",
        websiteUrl: "https://www.tyegoulder.com/",
        roleInProject: "Lead Developer",
        roleInEngSoc: "Tech Representitive"
    },
    { name: "Ege Cavus", roleInProject: 'Project Supervisor', roleInEngSoc: 'Technology Officer', link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" }
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
    { name: "Darina Mollova", link: "https://media.licdn.com/dms/image/v2/D4D03AQE7UjhU5N8KiQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1700155602640?e=1737590400&v=beta&t=o7V3ci48S_OfP7rP6CbTvd4rB6vVVktsR_VB4kKt2JM" },
    { name: "Lily Hayes", link: "https://media.licdn.com/dms/image/v2/D4E03AQE7RNYqtbC-Ew/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1713867586307?e=1737590400&v=beta&t=eJNDQTfE2ANezuQukTMjjA9qHFPnR_eDOp8NGMuxvrc" },
    { name: "Jash Navati", link: "https://media.licdn.com/dms/image/v2/D4E03AQF6YXtxeqYKtA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1700051030471?e=1737590400&v=beta&t=2Y5fFfWICBgrvzUrJ3g1vIlZNtJZiFnVyq99BYHdFYk" },
    { name: "Mihir Annapureddy", link: "https://media.licdn.com/dms/image/v2/C4E03AQEvn5Reid0BOA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1667924463348?e=1737590400&v=beta&t=Q5nyPbnZBjv_iepQ1vqssEXWExqKL3ZzlTfDopNU7mE" },
    { name: "Karam Sandhar", link: "https://media.licdn.com/dms/image/v2/D4E03AQG9L7V5dyBSnw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1710706199013?e=1737590400&v=beta&t=xqPEhnHgboEt45ZkqMUmMdS_saLdgplNVUgfWCT3m9o" },
    { name: "Ege Cavus", link: "https://images.squarespace-cdn.com/content/v1/62adc0df9ad5a8506ebfd27e/507c9700-ceed-4942-bfcc-f2f255b475de/WhatsApp+Image+2024-05-29+at+10.10.52_f4f2da27.jpg?format=750w" },
    { name: "Tye Goulder", link: "https://media.licdn.com/dms/image/v2/D4E03AQFGV_qKseoGkw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1729184073149?e=1737590400&v=beta&t=yELowMAMCezNDfqnfDJFWbXNxbN9bLyTuv7A5WQeGsg" },
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
                        The Warwick Engineering Society (EngSoc) is a student-run organization at the University of Warwick. We're bridging the gap between academia and industry, providing our members with valuable resources, networking opportunities, and events to enhance their engineering careers.
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
            <Accordion defaultValue='item-1' type="single" collapsible className="w-full [&_[data-radix-accordion-content]]:!pb-4">
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
                <div className='flex justify-between w-full'>
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
                            <p className="text-gray-300 text-sm">{developer.roleInProject}, {developer.roleInEngSoc} in EngSoc</p>
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