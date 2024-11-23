
const MAX_RETRIES = 2;
interface FetchOptions {
    BASE_URL: string;
}

export async function fetchHTMLTextWithProxy({ BASE_URL }: FetchOptions): Promise<Response> {
    const isProduction = process.env.NODE_ENV === "production"
    const fullUrl = `${BASE_URL}${origin}`;

    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

    let url: string;
    let retries = 0;

    while (retries <= MAX_RETRIES) {
        try {
            if (isProduction) {
                url = useProxy(fullUrl);
            } else {
                const testDataURL = process.env.TEST_DATA_URL;
                if (!testDataURL) throw new Error("TEST_DATA_URL is not defined in .env file.");
                url = testDataURL; // For testing
            }

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return res;
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed:`, error);

            if (isProduction && retries === 0) {
                console.log("Retrying without proxy...");
                url = fullUrl;
            } else if (retries === MAX_RETRIES) {
                throw new Error(`Failed to fetch data after ${MAX_RETRIES} attempts.`);
            }

            retries++;
        }
    }

    throw new Error("Unexpected error occurred.");
}

function useProxy(targetUrl: string): string {
    const PROXY_URL = process.env.PROXY_URL;
    const PROXY_API_KEY = process.env.PROXY_API_KEY;
    if (!PROXY_URL || !PROXY_API_KEY) throw new Error("PROXY_URL or PROXY_API_KEY is not defined in .env file.");
    return `${PROXY_URL}${new URLSearchParams({
        api_key: process.env.PROXY_API_KEY!,
        url: targetUrl
    })}`;
}