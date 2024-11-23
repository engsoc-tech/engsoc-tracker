import cron from 'node-cron';
// Import required libraries
import axios from 'axios';
import cheerio from 'cheerio';

import prisma from "@/db/prisma"; // Import the Prisma client
import { env } from '@/env';
import { ApplicationSchema, ApplicationType } from '@/schemas/applications';
// Load environment variables
interface Details {
  salary?: string;
  location?: string;
  'degree required'?: string;
  'job type'?: string;
  deadline?: string;
  starting?: string;
}

async function scrapeGradcracker() {
  console.log('Starting scrape job...');

  try {
    console.log('Fetching Gradcracker search page...');
    const { data } = await axios.get('https://www.gradcracker.com/search/all-disciplines/engineering-jobs');
    console.log('Gradcracker page fetched successfully');

    const $: cheerio.Root = cheerio.load(data);
    console.log('HTML content loaded into Cheerio');

    console.log('Extracting job listings...');
    const applications = $('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded').map((index, element) => {
      console.log(`Processing job listing ${index + 1}`);
      const $element = $(element);

      const title = $element.find('a.tw-block.tw-text-base.tw-font-semibold').text().trim();
      console.log(`Job title: ${title}`);

      const company = $element.find('.tw-flex.tw-flex-col.tw-justify-center.tw-flex-1.tw-text-xs.tw-font-semibold').text().trim();
      console.log(`Company: ${company}`);

      const link = $element.find('a.tw-block.tw-text-base.tw-font-semibold').attr('href');
      console.log(`Job link: ${link}`);

      const engineering = $element.find('.tw-text-xs.tw-font-bold.tw-text-gray-800').text().trim();
      console.log(`Engineering discipline: ${engineering}`);

      const details: Details = {};
      $element.find('ul li').each((_, li) => {
        const text = $(li).text().trim();
        const [key, value] = text.split(':').map(s => s.trim());
        details[key.toLowerCase() as keyof Details] = value;
      });
      console.log('Job details:', details);

      // Determine the type based on the job title or details
      let type: ApplicationType['type'];
      if (title.toLowerCase().includes('internship')) {
        type = 'Internship';
      } else if (title.toLowerCase().includes('placement')) {
        type = 'Placement';
      } else {
        type = 'Graduate';
      }
      console.log(`Job type determined: ${type}`);

      // Parse dates
      const now = new Date();
      const openDate = now.toISOString();
      const closeDate = details.deadline ? new Date(details.deadline).toISOString() : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      console.log(`Open date: ${openDate}, Close date: ${closeDate}`);

      const application: ApplicationType = {
        id: `${company}-${title}`.replace(/\s+/g, '-').toLowerCase(),
        programme: title,
        company,
        type,
        engineering,
        salary: details.salary,
        location: details.location,
        openDate,
        closeDate,
        requiresCv: true,
        requiresCoverLetter: false,
        requiresWrittenAnswers: false,
        isSponsored: undefined,
        notes: details['job type'],
        link: link || '',
      };

      console.log('Application object created:', application);

      // Validate the application object against the Zod schema
      try {
        ApplicationSchema.parse(application);
        console.log('Application validated successfully');
        return application;
      } catch (error) {
        console.error(`Validation error for application: ${title}`, error);
        return null;
      }
    }).get().filter(Boolean) as ApplicationType[]; // Convert to array, remove null entries, and assert type

    console.log(`Scraped ${applications.length} valid applications`);

    console.log('Updating database with scraped applications...');
    for (const app of applications) {
      await prisma.application.upsert({
        where: { id: app.id },
        update: app,
        create: app,
      });
      console.log(`Upserted application: ${app.id}`);
    }

    console.log('Database updated successfully');

  } catch (error) {
    console.error('An error occurred during scraping:', error);
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
  }
}

console.log('Setting up cron job for daily scraping...');
cron.schedule('0 1 * * *', () => {
  console.log('Running scheduled scrape job...');
  scrapeGradcracker();
});

console.log('Running initial scrape job...');
scrapeGradcracker();

console.log('Scraper scheduled to run daily at 1:00 AM');
