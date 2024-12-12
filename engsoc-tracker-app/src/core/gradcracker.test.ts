import fs from 'fs';
import path from 'path';
import { ApplicationType } from '../schemas/applications';
import {
    describe, expect, test,
    beforeAll, it, jest
} from '@jest/globals';
import { JSDOM } from 'jsdom';
import {
    parseDate,
    scrapeGradcracker,
    scrapeGradcrackerDiscipline,
} from './gradcracker';

const testHtmlPath = path.join(__dirname, '../testing/Computing_Technology Opportunities _ Gradcracker - Careers for STEM Students.html');

describe('Gradcracker Scraper', () => {
    let dom: JSDOM;
    let document: Document;

    beforeAll(() => {
        const html = fs.readFileSync(testHtmlPath, 'utf-8');
        dom = new JSDOM(html);
        document = dom.window.document;
    });

    describe('parseDate', () => {
        it('should parse "Ongoing" correctly', () => {
            const result = parseDate('Ongoing');
            expect(result.getFullYear()).toBe(9999);
            expect(result.getMonth()).toBe(11);
            expect(result.getDate()).toBe(31);
        });

        it('should parse a valid date string correctly', () => {
            const result = parseDate('2024-12-31');
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(11);
            expect(result.getDate()).toBe(31);
        });

        it('should parse a date in "Month Day, Year" format correctly', () => {
            const result = parseDate('December 31st, 2024');
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(11);
            expect(result.getDate()).toBe(31);
        });

        it('should return current date for unparseable strings', () => {
            const result = parseDate('Invalid Date');
            const now = new Date();
            expect(result.getFullYear()).toBe(now.getFullYear());
            expect(result.getMonth()).toBe(now.getMonth());
            expect(result.getDate()).toBe(now.getDate());
        });
    });

    describe('scrapeGradcracker - Offline Tests', () => {
        it('should scrape applications correctly from local file', async () => {
            const applications = await scrapeGradcrackerDiscipline('', testHtmlPath);
            expect(applications).toBeInstanceOf(Array);
            expect(applications.length).toBeGreaterThan(0);

            const firstApp = applications[0];
            expect(firstApp).toHaveProperty('id');
            expect(firstApp).toHaveProperty('programme');
            expect(firstApp).toHaveProperty('company');
            expect(firstApp).toHaveProperty('type');
            expect(firstApp).toHaveProperty('engineering');
            expect(firstApp).toHaveProperty('openDate');
            expect(firstApp).toHaveProperty('closeDate');
            expect(firstApp).toHaveProperty('requiresCv');
            expect(firstApp).toHaveProperty('requiresCoverLetter');
            expect(firstApp).toHaveProperty('requiresWrittenAnswers');
            expect(firstApp).toHaveProperty('isSponsored');
            expect(firstApp).toHaveProperty('notes');
            expect(firstApp).toHaveProperty('link');
        });


        it('should scrape applications for all disciplines from local file', async () => {
            const applications = await scrapeGradcracker('', testHtmlPath);
            expect(applications).toBeInstanceOf(Array);
            expect(applications.length).toBeGreaterThan(0);

            // Check if applications from different disciplines are present
            const disciplines = new Set(applications.map(app => app.engineering[0]));
            expect(disciplines.size).toBeGreaterThan(1);
        });
    });

    // describe('scrapeGradcracker - Online Test', () => {
    //     it('should scrape applications from live website', async () => {
    //         jest.setTimeout(30000); // Increase timeout for online test
    //         const applications = await scrapeGradcracker('computing-technology');
    //         expect(applications).toBeInstanceOf(Array);
    //         expect(applications.length).toBeGreaterThan(0);

    //         const firstApp = applications[0];
    //         expect(firstApp).toHaveProperty('id');
    //         expect(firstApp).toHaveProperty('programme');
    //         expect(firstApp).toHaveProperty('company');
    //         expect(firstApp).toHaveProperty('type');
    //         expect(firstApp).toHaveProperty('engineering');
    //         expect(firstApp).toHaveProperty('openDate');
    //         expect(firstApp).toHaveProperty('closeDate');
    //         expect(firstApp).toHaveProperty('requiresCv');
    //         expect(firstApp).toHaveProperty('requiresCoverLetter');
    //         expect(firstApp).toHaveProperty('requiresWrittenAnswers');
    //         expect(firstApp).toHaveProperty('isSponsored');
    //         expect(firstApp).toHaveProperty('notes');
    //         expect(firstApp).toHaveProperty('link');
    //     }, 30000);
    // });
});

