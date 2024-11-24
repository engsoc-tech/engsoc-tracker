import Link from 'next/link'

export default function JobListings() {
    return (
        <div className="tw-flex-[3]">
            <div className="tw-mb-8 tw-overflow-hidden tw-border tw-border-gray-100 tw-rounded">
                <Link href="https://google.com">
                    <img
                        src="https://images.gradcracker.com/eyJrZXkiOiJpbnZlbnRvcnlcLzE4NTU3XC82NzNiMTliYmVmZDlmLnBuZyIsImVkaXRzIjp7InRvRm9ybWF0Ijoid2VicCIsIndlYnAiOnsicXVhbGl0eSI6ODB9fX0=?signature=7d44359ecae0263f0448effaa12037094ea785a36bd338c1c17bfb6c5b1ffc5e"
                        width={1250}
                        height={340}
                        alt=""
                        className="w-full"
                    />
                </Link>
            </div>

            <div className="tw-flex tw-items-center tw-py-3 tw-bg-gray-200 tw-rounded">
                <div className="tw-flex-1 tw-pl-3 tw-text-center">
                    <div className="tw-text-sm tw-font-semibold tw-text-gray-900">
                        Jobs accepting<br />Aerospace disciplines
                    </div>
                </div>
                <div className="tw-flex-1 tw-text-center">
                    <div className="tw-text-2xl tw-font-bold tw-text-orange-500">155</div>
                    <div className="tw-text-sm tw-font-semibold tw-text-gray-900">Employers</div>
                </div>
                <div className="tw-flex-1 tw-text-center">
                    <div className="tw-text-2xl tw-font-bold tw-text-orange-500">1,275</div>
                    <div className="tw-text-sm tw-font-semibold tw-text-gray-900">Opportunities</div>
                </div>
                <div className="tw-flex-1 tw-text-center">
                    <div className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-center tw-text-gray-800">Sort results by</div>
                    <select className="tw-px-2 tw-py-1 tw-text-sm tw-font-semibold tw-border tw-border-gray-300 tw-rounded">
                        <option value="/search/aerospace/engineering-jobs?order=relevance" selected>Discipline Relevance</option>
                        <option value="/search/aerospace/engineering-jobs?order=deadlines">Deadline</option>
                        <option value="/search/aerospace/engineering-jobs?order=start_date">Start Date</option>
                        <option value="/search/aerospace/engineering-jobs?order=grade_asc">Grade (Ascending)</option>
                        <option value="/search/aerospace/engineering-jobs?order=grade_desc">Grade (Descending)</option>
                        <option value="/search/aerospace/engineering-jobs?order=dateAdded">Date Posted</option>
                    </select>
                </div>
            </div>

            <div className="tw-flex tw-items-center tw-my-4 tw-space-x-4 tw-text-xs tw-font-semibold">
                <div className="">Filters</div>
                <Link href="/search/all-disciplines/engineering-jobs" className="tw-flex tw-items-center tw-px-2 tw-py-0.5 tw-text-gray-500 tw-bg-gray-200 tw-rounded-full tw-group tw-cursor-pointer hover:tw-no-underline">
                    <svg className="tw-w-3 tw-h-3 tw-mr-1 tw-text-gray-400 group-hover:tw-hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <svg className="tw-hidden tw-w-3 tw-h-3 tw-mr-1 tw-text-gray-400 tw-bg-white tw-rounded-full group-hover:tw-inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Aerospace
                </Link>
            </div>

            <JobListing
                title="Aerospace Electrical - Avionic Graduate"
                company="Leonardo"
                companyDescription="Leonardo is a key global player in aerospace, defence and security, with seven main sites across the UK."
                salary="£33,000"
                location="Yeovil (Somerset) (Hybrid)"
                degreeRequired="2:2 and above"
                jobType="Graduate Opportunity  (Hiring multiple candidates)"
                startDate="September 2025"
                deadline="Ongoing"
                disciplines={["Aeronautics", "Aerospace", "Electronic", "Electrical"]}
                companyLogo="/path-to-leonardo-logo.png"
                companyColor="#ef002a"
            />

            <JobListing
                title="Air Engineer Officers"
                company="Royal Navy"
                companyDescription="The Royal Navy is Britain's maritime Armed Force. It prevents conflict, responds to threat and provides aid."
                salary="A starting salary of over £33,000, rising to around £41,000 after just two years + £27,000 joining bonus"
                location="Dartmouth then UK & International Travel"
                degreeRequired="All grades"
                jobType="Graduate Opportunity  (Hiring multiple candidates)"
                deadline="Ongoing"
                disciplines={["Aerospace", "Aeronautics", "Electrical", "Mechanical"]}
                companyLogo="/path-to-royal-navy-logo.jpg"
                companyColor="#010f3b"
            />
        </div>
    )
}

interface JobListingProps {
    title: string
    company: string
    companyDescription: string
    salary: string
    location: string
    degreeRequired: string
    jobType: string
    startDate?: string
    deadline: string
    disciplines: string[]
    companyLogo: string
    companyColor: string
}

function JobListing({
    title,
    company,
    companyDescription,
    salary,
    location,
    degreeRequired,
    jobType,
    startDate,
    deadline,
    disciplines,
    companyLogo,
    companyColor
}: JobListingProps) {
    return (
        <div className="tw-relative tw-mb-4 tw-border-2 tw-border-gray-200 tw-rounded">
            <div className="tw-flex tw-p-4">
                <div className="tw-w-3/5 tw-pr-4 tw-space-y-2">
                    <Link href="https://google.com" className="tw-block tw-text-base tw-font-semibold" style={{ color: companyColor }}>
                        {title}
                    </Link>

                    <div className="tw-text-xs tw-font-bold tw-text-gray-800">{disciplines.join(', ')}.</div>

                    <ul className="tw-pl-0 tw-mt-0 tw-mb-0 tw-space-y-1.5 tw-text-xs tw-font-medium tw-py-2 tw-text-gray-500 tw-list-none">
                        <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Salary:</span> {salary}</li>
                        <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Location:</span> {location}</li>
                        <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Degree required:</span> {degreeRequired}</li>
                        <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Job type:</span> {jobType}</li>
                        {startDate && <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Starting:</span> {startDate}</li>}
                        <li className="tw-flex"><span className="tw-pr-1 tw-font-semibold tw-text-gray-900">Deadline:</span> {deadline}</li>
                    </ul>

                    <button className="tw-shadow-sm tw-text-[11px] tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-font-semibold tw-text-gray-500 tw-border tw-border-gray-300 tw-rounded tw-cursor-pointer">
                        <svg className="tw-w-4 tw-h-4 tw-mr-1.5 tw-opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg> Add to your shortlist
                    </button>
                </div>
                <div className="tw-flex tw-flex-col tw-w-2/5 tw-pl-4 tw-space-y-2 tw-border-l-2 tw-border-gray-100">
                    <Link href="https://google.com">
                        <img src={companyLogo} width={76} height={38} alt={company} />
                    </Link>

                    <div className="tw-flex tw-flex-col tw-justify-center tw-flex-1 tw-text-xs tw-font-semibold" style={{ color: companyColor }}>
                        {companyDescription}
                    </div>

                    <div className="tw-flex tw-flex-col tw-justify-center tw-flex-1 tw-space-y-1">
                        <Link href="https://google.com" className="tw-flex tw-items-center tw-text-xs tw-font-semibold tw-text-gray-500">
                            <div>View all our placements / internships</div>
                            <svg className="tw-w-4 tw-h-4 tw-ml-2 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </Link>
                        <Link href="https://google.com" className="tw-flex tw-items-center tw-text-xs tw-font-semibold tw-text-gray-500">
                            <div>View all our graduate jobs</div>
                            <svg className="tw-w-4 tw-h-4 tw-ml-2 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </Link>
                    </div>

                    <div>
                        <button className="tw-text-[11px] tw-inline-flex tw-items-center tw-px-2 tw-py-1 tw-font-semibold tw-text-gray-500 tw-shadow-sm tw-border tw-border-gray-300 tw-rounded tw-cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="tw-w-4 tw-h-4 tw-mr-1 tw-text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            Follow this employer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

