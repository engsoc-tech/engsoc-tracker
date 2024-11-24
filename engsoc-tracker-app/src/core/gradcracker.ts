import * as cheerio from 'cheerio';
import prisma from "@/db/prisma";
import { env } from '@/env';
import { ApplicationType, ModifiedApplicationSchema, ModifiedApplicationType } from '@/schemas/applications';
import { fetchHTMLTextWithProxy } from './fetch-html-text';
import { engineeringTypes, EngineeringURLtype } from './map';
import { z } from 'zod';
import { ApplicationSchema, EngineeringTypeSchema } from '../../prisma/generated/zod';
import { EngineeringType } from '@prisma/client';
interface Details {
  salary?: string;
  location?: string;
  engineering?: string;
  deadline?: string;
  starting?: string;
}
function parseDate(dateString: string): Date {
  console.log(`Attempting to parse date: ${dateString}`);

  // Check if the date is 'Ongoing'
  if (dateString === 'Ongoing') {
    console.log("Date is 'Ongoing'. Setting to far future date.");
    return new Date('9999-12-31'); // Use a far future date for 'Ongoing'
  }

  // Try parsing the date string directly
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    console.log(`Successfully parsed date directly: ${parsedDate}`);
    return parsedDate;
  }

  // Handle format like "November 29th, 2024"
  const match = dateString.match(/(\w+)\s(\d+)(?:st|nd|rd|th),\s(\d{4})/);
  if (match) {
    const [, month, day, year] = match;
    console.log(`Matched date format "Month Day, Year": ${month} ${day}, ${year}`);
    const formattedDate = new Date(`${month} ${day}, ${year}`);
    console.log(`Parsed date: ${formattedDate}`);
    return formattedDate;
  }

  // If all parsing attempts fail, log an error and return current date
  console.error(`Unable to parse date: ${dateString}. Falling back to current date.`);
  return new Date();
}

export async function scrapeGradcracker(type: EngineeringURLtype = 'all-disciplines'): Promise<ApplicationType[]> {
  console.log(`Starting Gradcracker scrape job for ${engineeringTypes.get(type)}...`)

  try {
    console.log('Fetching Gradcracker search page...')
    const url = `https://www.gradcracker.com/search/${type}/engineering-jobs`
    console.log(`Target URL: ${url}`)

    const response = await fetchHTMLTextWithProxy({ fullURL: url })
    console.log('Gradcracker page fetched successfully')

    const data = await response.text()
    console.log(`Received HTML content length: ${data.length} characters`)

    const $: cheerio.Root = cheerio.load(data)
    console.log('HTML content loaded into Cheerio')

    console.log('Extracting job listings...')
    const applications = $('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded').map((index, element) => {
      console.log(`Processing job listing ${index + 1}`)
      const $element = $(element)

      let company = ''
      const altText = $element.find('img').attr('alt');
      console.log(`Alt text: ${altText}`)
      if (!altText) {
        company = '-';
        console.log("No alt text found, setting company to '-'")
      } else {
        company = altText.trim()
      }
      console.log(`Job company: ${company}`)

      const title = $element.find('a.tw-block.tw-text-base.tw-font-semibold').text().trim()
      console.log(`Job title: ${title}`)

      const link = $element.find('a.tw-block.tw-text-base.tw-font-semibold').attr('href')
      console.log(`Job link: ${link}`)


      const engineeringText = $element.find('.tw-text-xs.tw-font-bold.tw-text-gray-800').text().trim();
      const engineeringTypes = engineeringText.split(',').map(type => {
        const trimmedType = type.trim();
        if (trimmedType.includes('Aerospace')) return "AEROSPACE";
        if (trimmedType.includes('Chemical')) return "CHEMICAL";
        if (trimmedType.includes('Civil')) return "CIVIL";
        if (trimmedType.includes('Computing') || trimmedType.includes('Software')) return "COMPUTING";
        if (trimmedType.includes('Electronic') || trimmedType.includes('Electrical')) return "ELECTRONIC";
        if (trimmedType.includes('Mechanical')) return "MECHANICAL";
        return null;
      }).filter((type): type is EngineeringType => type !== null);

      const engineering: EngineeringType[] = engineeringTypes.map(type => EngineeringTypeSchema.parse(type));
      console.log(`Engineering disciplines: ${engineering}`);

      const details: Details = {}
      $element.find('ul li').each((_, li) => {
        const text = $(li).text().trim()
        const [key, value] = text.split(':').map(s => s.trim())
        const camelCaseKey = key.toLowerCase().replace(/\s(.)/g, (_, char) => char.toUpperCase())
        details[camelCaseKey as keyof Details] = value
      })
      console.log('Job details:', details)

      let jobType: ApplicationType['type']
      if (title.toLowerCase().includes('internship')) {
        jobType = 'INTERNSHIP'
      } else if (title.toLowerCase().includes('placement')) {
        jobType = 'PLACEMENT'
      } else {
        jobType = 'GRADUATE'
      }
      console.log(`Job type determined: ${jobType}`)

      const now = new Date()
      const openDate = now;
      const closeDate = details.deadline ? parseDate(details.deadline) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      console.log(`Open date: ${openDate}, Close date: ${closeDate}`)

      const application: ModifiedApplicationType = {
        // id: `${company}-${title}`.replace(/\s+/g, '-').toLowerCase(),
        programme: title,
        company,
        type: jobType,
        engineering,
        openDate,
        closeDate,
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: false,
        isSponsored: Math.random() < 0.5, // Randomly assign sponsored status
        notes: "",
        link: link || '',
      }

      console.log('Application object created:', application)

      try {
        ModifiedApplicationSchema.parse(application)
        console.log('Application validated successfully')
        return application
      } catch (error) {
        console.error(`Validation error for application: ${title}`, error)
        return null
      }
    }).get().filter(Boolean) as ApplicationType[]

    console.log(`Scraped ${applications.length} valid applications for ${engineeringTypes.get(type)}`)
    return applications

  } catch (error) {
    console.error(`An error occurred during scraping ${engineeringTypes.get(type)}:`, error)
    return []
  }
}

