
'use server'
import puppeteer from 'puppeteer';
import { getURL } from '../url-utilts';

export async function getGradcrackerOutLink(jobUrl: string, testHtmlPath?: string): Promise<string> {
    let browser;
    console.log("Getting Gradcracker out link for job:", jobUrl);
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
        console.log("getting url...")
        const targetURL = getURL({ fullURL: jobUrl, useProxy: true });
        console.log("targetURL: ", targetURL);
        await page.goto(targetURL as string, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        // }

        const outLink = await page.evaluate(() => {
            const applyButton = document.querySelector('.js__apply-button') as HTMLAnchorElement;
            return applyButton?.href || null;
        });
        console.log("reutrning outlinl ", outLink)
        if (!outLink) return ""

        // Navigate to the outlink and wait for all redirects to complete
        console.log("Following outlink:", outLink)
        const ol = getURL({ fullURL: outLink, useProxy: true });
        await page.goto(ol as string, {
            waitUntil: "networkidle0",
            timeout: 30000,
        })

        // Get the final URL after all redirects
        const finalOutLink = page.url()
        console.log("Final URL after redirects:", finalOutLink)

        return finalOutLink.replace('gradcracker', 'engsoc').replace('Gradcracker', 'EngSoc');
    } catch (error) {
        console.error('Error getting Gradcracker out link:', error);
        return "";
    } finally {
        if (browser) await browser.close();
    }
}