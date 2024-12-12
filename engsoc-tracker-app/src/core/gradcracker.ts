import { ApplicationType } from './../schemas/applications';
import puppeteer from 'puppeteer';
import { z } from 'zod';
import { getURL } from './url-utilts';
import { ApplicationSchema, EngineeringTypeSchema } from '../../prisma/generated/zod';
import { EngineeringType, PositionType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

interface Details {
  salary?: string;
  location?: string;
  engineering?: string;
  deadline?: string;
  starting?: string
}

export function parseDate(dateString: string): Date {
  console.log(`Attempting to parse date: ${dateString}`);

  if (dateString === 'Ongoing') {
    console.log("Date is 'Ongoing'. Setting to far future date.");
    return new Date('9999-12-31');
  }

  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    console.log(`Successfully parsed date directly: ${parsedDate}`);
    return parsedDate;
  }

  const match = dateString.match(/(\w+)\s(\d+)(?:st|nd|rd|th),\s(\d{4})/);
  if (match) {
    const [, month, day, year] = match;
    console.log(`Matched date format "Month Day, Year": ${month} ${day}, ${year}`);
    const formattedDate = new Date(`${month} ${day}, ${year}`);
    console.log(`Parsed date: ${formattedDate}`);
    return formattedDate;
  }

  console.error(`Unable to parse date: ${dateString}. Falling back to current date.`);
  return new Date();
}

type GradCrackerDiscipline = 'all-disciplines' | 'aerospace' | 'chemical-process' | 'civil-building' | 'computing-technology' | 'electronic-electrical' | 'mechanical-engineering';

export async function scrapeGradcracker(type: GradCrackerDiscipline | "" = 'all-disciplines', testHtmlPath?: string): Promise<ApplicationType[]> {
  console.log("Scrape Gradcracker discipline called with type:", type);
  try {
    const disciplinesToScrape: GradCrackerDiscipline[] = [
      'all-disciplines',
      // 'aerospace',
      // 'chemical-process',
      // 'civil-building',
      // 'computing-technology',
      // 'electronic-electrical',
      // 'mechanical-engineering'
    ];
    let gradCrackerApps: ApplicationType[] = [];
    for (const discipline of disciplinesToScrape) {
      gradCrackerApps = [...gradCrackerApps, ...await scrapeGradcrackerDiscipline(discipline, testHtmlPath)];
    }
    return gradCrackerApps;
  } catch (error) {
    console.error('Error in scrapeGradcracker:', error);
    return [];
  }
}

export async function scrapeGradcrackerDiscipline(discipline: GradCrackerDiscipline | "", testHtmlPath?: string): Promise<ApplicationType[]> {
  let browser;
  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    if (testHtmlPath) {
      console.log(`Using test HTML file: ${testHtmlPath}`);
      const htmlContent = fs.readFileSync(path.resolve(testHtmlPath), 'utf-8');
      await page.setContent(htmlContent);
    } else {
      console.log('Fetching Gradcracker search page...');
      const originalURL = `https://www.gradcracker.com/search/${discipline}/engineering-jobs`;
      const targetURL = getURL({ fullURL: originalURL, useProxy: process.env.NODE_ENV === 'production' });
      console.log(`Target URL: ${targetURL}`);
      await page.goto(targetURL as string, { waitUntil: 'networkidle0' });
    }
    console.log('Gradcracker page loaded successfully');

    const applications: ApplicationType[] = [];

    while (true) {
      console.log('Extracting job listings...');
      const pageApplications = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded')).map((element, index) => {
          console.log(`Processing job listing ${index + 1}`);

          const company = element.querySelector('img')?.alt?.trim() || '-';
          console.log(`Job company: ${company}`);

          const title = element.querySelector('a.tw-block.tw-text-base.tw-font-semibold')?.textContent?.trim() || '';
          console.log(`Job title: ${title}`);

          const link = element.querySelector('a.tw-block.tw-text-base.tw-font-semibold')?.getAttribute('href') || '';
          console.log(`Job link: ${link}`);

          const engineeringText = element.querySelector('.tw-text-xs.tw-font-bold.tw-text-gray-800')?.textContent?.trim() || '';
          const engineering = engineeringText.split(',').map(type => type.trim());
          console.log(`Engineering disciplines: ${engineering}`);

          const details: Details = {};
          element.querySelectorAll('ul li').forEach((li) => {
            const text = li.textContent?.trim() || '';
            const [key, value] = text.split(':').map(s => s.trim());
            const camelCaseKey = key.toLowerCase().replace(/\s(.)/g, (_, char) => char.toUpperCase());
            details[camelCaseKey as keyof Details] = value;
          });
          console.log('Job details:', details);

          return {
            id: `${company}0${title}`.replace(/[\s-]+/g, '0').toLowerCase(),
            programme: title,
            company,
            type: 'Graduate' as PositionType,
            engineering,
            openDate: new Date().toISOString(),
            closeDate: details.deadline,
            requiresCv: true,
            requiresCoverLetter: false,
            requiresWrittenAnswers: false,
            isSponsored: Math.random() < 0.5,
            notes: "",
            link,
          };
        });
      });

      for (const app of pageApplications) {
        app.closeDate = app.closeDate ? parseDate(app.closeDate).toISOString() : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
        app.engineering = app.engineering.map(eng => {
          if (eng.includes('Electrical')) return 'Electronic';
          return eng as EngineeringType;
        }).filter((eng): eng is EngineeringType => EngineeringTypeSchema.safeParse(eng).success);

        try {
          const validatedApp = ApplicationSchema.parse(app);
          applications.push(validatedApp);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.errors);
          }
        }
      }

      if (testHtmlPath) {
        // If using a test HTML file, we don't need to paginate
        break;
      }

      const nextButton = await page.$('a[rel="next"]');
      if (nextButton) {
        console.log('Moving to next page...');
        await nextButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
      } else {
        console.log('No more pages to scrape');
        break;
      }
    }

    console.log(`Scraped ${applications.length} applications successfully`);
    console.log('Applications:', applications);
    return applications;
  } catch (error) {
    console.error('Error scraping Gradcracker:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}