const MAX_RETRIES = 2;
interface FetchOptions {
    fullURL: string;
}

const TEST_DATA_URL = "http://localhost:3000/api/testing/gradcracker";

export async function fetchHtml({ fullURL }: FetchOptions): Promise<Response> {
    console.log('Starting fetchHtml function');

    const isProduction = process.env.NODE_ENV === "production"
    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

    let url: string;
    let retries = 0;

    while (retries <= MAX_RETRIES) {
        console.log(`Attempt ${retries + 1} of ${MAX_RETRIES + 1}`);
        try {
            if (isProduction) {
                console.log('Using proxy in production environment');
                // url = useProxy(fullURL);
                url = fullURL
                console.log(`Proxy URL: ${url}`);
            } else {
                console.log('Using test URL in development environment');
                if (!TEST_DATA_URL) {
                    console.error("TEST_DATA_URL is not defined");
                    throw new Error("TEST_DATA_URL is not defined");
                }
                url = TEST_DATA_URL; // For testing
                console.log(`Using test URL: ${url}`);
            }

            console.log(`Fetching from URL: ${url}`);
            const res = await fetch(url);
            console.log(`Fetch response status: ${res.status}`);

            if (!res.ok) {
                console.error(`HTTP error! status: ${res.status}`);
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            console.log('Fetch successful');
            return res;
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed:`, error);

            if (isProduction && retries === 0) {
                console.log("Retrying without proxy...");
                url = fullURL;
                console.log(`Direct URL for retry: ${url}`);
            } else if (retries === MAX_RETRIES) {
                console.error(`Failed to fetch data after ${MAX_RETRIES} attempts.`);
                throw new Error(`Failed to fetch data after ${MAX_RETRIES} attempts.`);
            }

            retries++;
            console.log(`Incrementing retry count to ${retries}`);
        }
    }

    console.error("Unexpected error occurred.");
    throw new Error("Unexpected error occurred.");
}

function useProxy(targetUrl: string): string {
    console.log('Entering useProxy function');
    const PROXY_URL = process.env.PROXY_URL;
    const PROXY_API_KEY = process.env.PROXY_API_KEY;

    console.log(`PROXY_URL defined: ${!!PROXY_URL}`);
    console.log(`PROXY_API_KEY defined: ${!!PROXY_API_KEY}`);

    if (!PROXY_URL || !PROXY_API_KEY) {
        console.error("PROXY_URL or PROXY_API_KEY is not defined in .env file.");
        throw new Error("PROXY_URL or PROXY_API_KEY is not defined in .env file.");
    }

    const proxyUrl = `${PROXY_URL}${new URLSearchParams({
        api_key: PROXY_API_KEY,
        url: targetUrl
    })}`;

    console.log(`Generated proxy URL: ${proxyUrl}`);
    return proxyUrl;
}

