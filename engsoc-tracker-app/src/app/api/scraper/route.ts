import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";


export const maxDuration = 20;


export async function POST(request: Request) {
  const { siteUrl } = await request.json();

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;
  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH ||
      (await chromium.executablePath(
        "https://config-bucket-897722695794.s3.amazonaws.com/chromium-v131.0.0-pack.tar"
      )),
    headless: chromium.headless,
  });
  const page = await browser.newPage();
  await page.goto(siteUrl, {
    waitUntil: "networkidle2"
  });
  const cookies = await page.evaluate(() => document.cookie);
  console.log(cookies);
  const jobTitle = await page.$$eval("div", (titles) => {
    return titles.map((option) => option.textContent);
  });
  await browser.close();

  return Response.json({
    siteUrl,
    jobTitle,
  });
}