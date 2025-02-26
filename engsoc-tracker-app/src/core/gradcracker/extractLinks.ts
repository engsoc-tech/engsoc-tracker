'use server'
import puppeteer from 'puppeteer';
import { getURL } from '../url-utilts';
import fs from 'fs';

//extracts the outer links only. out links are proceeded to be extracted in the next step.
export async function extractGradcrackerLinks(discipline: string = 'all-disciplines', testHtmlPath?: string): Promise<string[]> {
    let browser;
    try {
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
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

        // if (testHtmlPath) {
        //     const htmlContent = fs.readFileSync(testHtmlPath, 'utf-8');
        //     await page.setContent(htmlContent);
        // } else {
        const originalURL = `https://www.gradcracker.com/search/${discipline}/engineering-jobs`;
        const targetURL = getURL({ fullURL: originalURL, useProxy: false });
        await page.goto(targetURL as string, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        // }

        const links: string[] = [];

        while (true) {
            const pageLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.tw-w-3/5.tw-pr-4.tw-space-y-2 a'))
                    .filter(el => el.getAttribute('href')?.includes('/hub/'))
                    .map(el => el.getAttribute('href'))
                    .filter((href): href is string => href !== null);
            });

            links.push(...pageLinks);

            if (testHtmlPath) break;

            const nextButton = await page.$('a[rel="next"]');
            if (!nextButton) break;

            await nextButton.click();
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            await new Promise(resolve => setTimeout(resolve, 15000)); // Rate limiting
        }

        return links;
    } catch (error) {
        console.error('Error extracting Gradcracker links:', error);
        return [];
    } finally {
        if (browser) await browser.close();
    }
}