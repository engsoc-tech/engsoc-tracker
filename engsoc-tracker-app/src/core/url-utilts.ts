
interface URLOptions {
    fullURL: string;
    useProxy: boolean;
}

export function getURL({ fullURL, useProxy }: URLOptions): string | Buffer {
    console.log('Starting getURL function');
    console.log(`Retry count: ${useProxy}`);

    if (useProxy) {
        console.log('Using proxy');
        try {
            const proxyUrl = useProxyURL(fullURL);
            console.log(`Proxy URL: ${proxyUrl}`);
            return proxyUrl;
        } catch (error) {
            console.error('Error using proxy, falling back to direct URL:', error);
        }
    }

    console.log(`Using direct URL: ${fullURL}`);
    return fullURL;
}

function useProxyURL(targetUrl: string): string {
    console.log('Entering useProxyURL function');
    const PROXY_URL = process.env.PROXY_URL;
    const PROXY_API_KEY = process.env.PROXY_API_KEY;

    console.log(`PROXY_URL defined: ${!!PROXY_URL}`);
    console.log(`PROXY_API_KEY defined: ${!!PROXY_API_KEY}`);

    if (!PROXY_URL || !PROXY_API_KEY) {
        console.error("PROXY_URL or PROXY_API_KEY is not defined in .env file.");
        throw new Error("PROXY_URL or PROXY_API_KEY is not defined in .env file.");
    }

    const proxyUrl = `${PROXY_URL}?${new URLSearchParams({
        api_key: PROXY_API_KEY,
        url: targetUrl
    })}`;

    console.log(`Generated proxy URL: ${proxyUrl}`);
    return proxyUrl;
}
