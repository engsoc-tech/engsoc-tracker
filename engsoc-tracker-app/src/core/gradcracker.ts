'use server'
import { ApplicationType } from './../schemas/applications';
import puppeteer from 'puppeteer';
import { getURL } from './url-utilts';
import { EngineeringType, PositionType } from '@prisma/client';
import { getGcOutLinkOrEmail } from './gradcracker/getOutLinks';
import { addYears, format, parse } from 'date-fns';
import prisma from '@/db/prisma';
import { saveApplicationToDatabaseAndScrambleName } from './main';
import * as crypto from 'crypto';

export async function parseDate(dateString: string): Promise<Date> {
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
// Helper function to map scraped engineering types to EngineeringType enum
function mapToEngineeringType(type: string): EngineeringType | null {
  // Clean the input string
  const cleanType = type.trim()
    .replace(/\./g, '')
    .replace(/\s+/g, '')
    .toLowerCase();

  // Mapping object for engineering types
  const engineeringTypeMap: { [key: string]: EngineeringType } = {
    'aerospace': EngineeringType.Aerospace,
    'chemical': EngineeringType.Chemical,
    'civil': EngineeringType.Civil,
    'computing': EngineeringType.Computing,
    'electronic': EngineeringType.Electronic,
    'mechanical': EngineeringType.Mechanical,
    'software': EngineeringType.Software,
    // Add common variations
    'technology': EngineeringType.Computing,

    'electrical': EngineeringType.Electronic,
    'computer': EngineeringType.Computing,
    'data': EngineeringType.Computing,
  };

  // Direct match
  if (engineeringTypeMap[cleanType]) {
    return engineeringTypeMap[cleanType];
  }

  // Check if type contains any of the known engineering types
  for (const key in engineeringTypeMap) {
    if (type.toLowerCase().includes(key)) {
      return engineeringTypeMap[key];
    }
  }

  return null;
}
export async function scrapeGradcracker(maxOfEachDisc: number): Promise<ApplicationType[]> {
  console.log("Scrape Gradcracker discipline called with maxOfEachDisc:", maxOfEachDisc);
  try {
    const disciplinesToScrape: GradCrackerDiscipline[] = [
      // 'all-disciplines',
      // 'aerospace',
      // 'chemical-process',
      // 'civil-building',
      'computing-technology',
      // 'electronic-electrical',
      // 'mechanical-engineering'
    ];
    const gradCrackerApps: ApplicationType[] = [];
    for (const discipline of disciplinesToScrape) {
      const disciplineAppsGrad = await scrapeGradcrackerDiscipline(discipline, maxOfEachDisc, "engineering-graduate-jobs");
      const disciplineAppsPlaceInt = await scrapeGradcrackerDiscipline(discipline, maxOfEachDisc, "engineering-work-placements-internships");
      gradCrackerApps.push(...disciplineAppsGrad, ...disciplineAppsPlaceInt);
    }
    return gradCrackerApps;
  } catch (error) {
    console.error('Error in scrapeGradcracker:', error);
    return [];
  }
}

export async function scrapeGradcrackerDiscipline(discipline: GradCrackerDiscipline | "", max: number, type: "engineering-graduate-jobs" | "engineering-work-placements-internships"): Promise<ApplicationType[]> {
  let browser;
  console.log("Scrape Gradcracker discipline called with discipline:", discipline);
  try {
    console.log('Launching Puppeteer...');
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
    const page = await browser.newPage();

    console.log('Fetching Gradcracker search page...');
    const originalURL = `https://www.gradcracker.com/search/${discipline}/${type}`;
    //replace useProxy with process.env.NODE_ENV === 'production' if gradcracker starts blocking the request
    const targetURL = getURL({ fullURL: originalURL, useProxy: true });
    console.log(`Target URL: ${targetURL}`);
    const response = await page.goto(targetURL as string, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    if (!response) {
      throw new Error('No response received from the page');
    }

    if (response.status() === 404) {
      throw new Error('Page not found (404)');
    }

    if (!response.ok()) {
      throw new Error(`HTTP error! status: ${response.status()}`);
    }
    // Wait for the content to be loaded
    await page.waitForSelector('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded', { timeout: 10000 });
    // }
    console.log('Gradcracker page loaded successfully');


    console.log('Extracting job listings...');
    const pageApplications: {
      company: string;
      programme: string;
      link: string;
      engineering: string[];
      deadlineString: string;
      type: PositionType;
    }[] = await page.evaluate((maxLimit: number, appType: "engineering-graduate-jobs" | "engineering-work-placements-internships") => {
      const apps: {
        company: string;
        programme: string;
        link: string;
        engineering: string[];
        deadlineString: string;
        type: PositionType;
      }[] = [];
      const ApplicationElements = document.querySelectorAll('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded')

      for (const ApplicationElement of ApplicationElements) {
        const company = ApplicationElement.querySelector('img')?.alt?.trim() || '-';
        const title = ApplicationElement.querySelector('a.tw-block.tw-text-base.tw-font-semibold')?.textContent?.trim() || '';
        const _link = ApplicationElement.querySelector('a.tw-block.tw-text-base.tw-font-semibold')?.getAttribute('href') || '';
        const engineeringText = ApplicationElement.querySelector('.tw-text-xs.tw-font-bold.tw-text-gray-800')?.textContent?.trim() || '';
        const engineering = engineeringText.split(',').map(type => type.trim());
        let deadlineString = '';
        let type: PositionType = 'Graduate';

        const listItems = ApplicationElement.querySelectorAll('ul li');
        listItems.forEach((li) => {
          const text = li.textContent?.trim() || '';
          const [key, value] = text.split(':').map(s => s.trim());

          if (key === 'Deadline') {
            deadlineString = value;
            console.log("VALUE: ", value);
          }
        });
        if (appType == "engineering-work-placements-internships") {
          if (title.includes("Intern")) {
            type = "Internship";
          } else {
            type = "Placement";
          }
        }

        if (apps.length <= maxLimit) {

          apps.push({
            company,
            programme: title,
            link: _link,
            engineering,
            deadlineString,
            type,
          });
        } else {
          break;
        }
      }

      return apps
    }, max, type);
    console.log("Page Applications: ", pageApplications);
    const applications: ApplicationType[] = [];
    for (const appData of pageApplications) {
      let closeDate: Date;

      if (appData.deadlineString.toLowerCase() === 'ongoing') {
        closeDate = addYears(new Date(), 1);
      } else {
        const cleanDateStr = appData.deadlineString.replace(/(st|nd|rd|th)/g, '');
        closeDate = parse(cleanDateStr, 'MMMM d, yyyy', new Date());

        if (isNaN(closeDate.getTime())) {
          console.error('Invalid date parsed:', appData.deadlineString, 'Cleaned:', cleanDateStr);
          closeDate = addYears(new Date(), 1);
        }
      }

      // Map engineering types and filter out any that don't match the enum
      const validEngineeringTypes = appData.engineering
        .map(eng => mapToEngineeringType(eng))
        .filter((type): type is EngineeringType => type !== null);

      // Only create application if we have at least one valid engineering type
      if (validEngineeringTypes.length > 0 && appData.programme && appData.link) {
        const details: ApplicationType = {
          id: `${appData.company || "Unknown"}-${appData.programme}`.replace(/[\s-]+/g, '-').toLowerCase(),
          programme: appData.programme,
          postChecked: false,
          origProgramme: appData.programme,
          company: appData.company || 'Unknown',
          verified: false,
          type: appData.type,
          engineering: validEngineeringTypes,
          openDate: new Date(),
          closeDate,
          requiresCv: true,
          requiresCoverLetter: false,
          requiresWrittenAnswers: false,
          isSponsored: false,
          notes: "",
          link: appData.link,
        };

        //get true outlink
        const res = await getGcOutLinkOrEmail(details.link);
        details.link = res.outlink || crypto.randomBytes(20).toString('hex');
        if (!res.outlink) {
          //look for the how to apply email and add it to details.notes as 'CV and Cover Letter to: email'
          details.notes = `CV and Cover Letter to: ${res.email || 'Unknown'}`;
        }
        //save and scramble
        const pc = await saveApplicationToDatabaseAndScrambleName(details);
        applications.push(pc);

        // console.log('Extracted application with true out link:', {
        //   company: pc.company,
        //   origProgramme: pc.origProgramme,
        //   programme: pc.programme,
        //   type: pc.type,
        //   engineering: pc.engineering,
        //   closeDate: pc.closeDate,
        //   link: pc.link,
        // });

      } else {
        console.log('Skipping application due to no valid engineering types or programme:', appData);
      }
    }
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