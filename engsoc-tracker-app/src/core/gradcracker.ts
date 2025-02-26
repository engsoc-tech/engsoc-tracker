'use server'
import { ApplicationType } from './../schemas/applications';
import puppeteer from 'puppeteer';
import { getURL } from './url-utilts';
import { EngineeringType, PositionType } from '@prisma/client';
import { getGradcrackerOutLink } from './gradcracker/getOutLinks';
import { addYears, format, parse } from 'date-fns';
import { updateApplication } from './applications';


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
    'electrical': EngineeringType.Electronic,
    'computer': EngineeringType.Computing,
    'data': EngineeringType.Computing,
  };

  return engineeringTypeMap[cleanType] || null;
}
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
      const disciplineApps = await scrapeGradcrackerDiscipline(discipline);
      gradCrackerApps = [...gradCrackerApps, ...disciplineApps];
    }
    return gradCrackerApps;
  } catch (error) {
    console.error('Error in scrapeGradcracker:', error);
    return [];
  }
}

export async function scrapeGradcrackerDiscipline(discipline: GradCrackerDiscipline | ""): Promise<ApplicationType[]> {
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
    const originalURL = `https://www.gradcracker.com/search/${discipline}/engineering-jobs`;
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
    }[] = await page.evaluate(() => {
      const apps: {
        company: string;
        programme: string;
        link: string;
        engineering: string[];
        deadlineString: string;
        type: PositionType;
      }[] = [];
      const ApplicationElements = document.querySelectorAll('.tw-relative.tw-mb-4.tw-border-2.tw-border-gray-200.tw-rounded');

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
          } else if (key === 'Job type') {
            const lowercaseValue = value.toLowerCase();
            if (lowercaseValue.includes('placement') || lowercaseValue.includes('internship')) {
              type = lowercaseValue.includes('year') ? 'Placement' : 'Internship';
            }
          }
        });

        apps.push({
          company,
          programme: title,
          link: _link,
          engineering,
          deadlineString,
          type,
        });
      }

      return apps
    });

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
      if (validEngineeringTypes.length > 0 && appData.programme) {
        const details: ApplicationType = {
          id: `${appData.company || "Unknown"}-${appData.programme}`.replace(/[\s-]+/g, '-').toLowerCase(),
          programme: appData.programme,
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
        applications.push(details);

        console.log('Extracted application:', {
          company: details.company,
          programme: details.programme,
          type: details.type,
          engineering: details.engineering,
          deadline: format(details.closeDate, 'PPP'),
        });
      } else {
        console.log('Skipping application due to no valid engineering types or programme:', appData);
      }
    }

    const applicationsWithUpdatedLinks = [];
    for (const app of applications) {
      const link = await getGradcrackerOutLink(app.link);
      applicationsWithUpdatedLinks.push({ ...app, link });
      await updateApplication(`${app.company}-${app.programme}`.replace(/[\s-]+/g, '-').toLowerCase(), { ...app, link });
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
    console.log("Applications with updated links: ", applicationsWithUpdatedLinks);

    return applicationsWithUpdatedLinks;



  } catch (error) {
    console.error('Error scraping Gradcracker:', error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}