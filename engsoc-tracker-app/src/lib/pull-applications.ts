import { ApplicationType } from '../schemas/applications';
import { z } from 'zod';
import { ApplicationSchema } from '../../prisma/generated/zod';
import { getMockDataA, getMockDataB, getMockDataC } from './mock-data';


// Interface for source retrieval functions
interface SourceRetriever {
    name: string;
    retrieve: () => Promise<ApplicationType[]>;
}
// Mock function for retrieving from Source A
const retrieveFromSourceA: SourceRetriever = {
    name: 'Source A',
    retrieve: async () => {
        console.log('Retrieving from Source A...');
        // Simulate API call or web scraping
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getMockDataA();
    }
};

// Mock function for retrieving from Source B
const retrieveFromSourceB: SourceRetriever = {
    name: 'Source B',
    retrieve: async () => {
        console.log('Retrieving from Source B...');
        // Simulate API call or web scraping
        await new Promise(resolve => setTimeout(resolve, 1500));
        return getMockDataB();
    }
};

// Mock function for retrieving from Source C
const retrieveFromSourceC: SourceRetriever = {
    name: 'Source C',
    retrieve: async () => {
        console.log('Retrieving from Source C...');
        // Simulate API call or web scraping
        await new Promise(resolve => setTimeout(resolve, 2000));
        return getMockDataC();
    }
};

// Array of all source retrievers for pulling new applications
const sourceRetrievers: SourceRetriever[] = [
    retrieveFromSourceA,
    retrieveFromSourceB,
    retrieveFromSourceC,
];

// Main function to retrieve from all sources
export async function pullNewApplications(): Promise<ApplicationType[]> {
    console.log('Starting to pull new applications...');

    const allResults = await Promise.all(
        sourceRetrievers.map(async (retriever) => {
            try {
                const results = await retriever.retrieve();
                console.log(`Successfully retrieved ${results.length} items from ${retriever.name}`);
                return results;
            } catch (error) {
                console.error(`Error retrieving from ${retriever.name}:`, error);
                return [];
            }
        })
    );

    const flattenedResults = allResults.flat();
    console.log(`Pulled a total of ${flattenedResults.length} new applications from all sources`);

    return flattenedResults;
}

