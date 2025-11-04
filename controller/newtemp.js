import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path, { resolve } from 'path';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import "dotenv/config";
import { exec } from 'child_process';
import { humanizePage, humanType } from './humanize.js';



puppeteer.use(StealthPlugin());


// Utility function to introduce delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main function to fetch data
async function autoLogin(baseUrls) {

    console.log(Date.now());
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        defaultViewport: { width: 1080, height: 800 },
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--no-zygote',
            '--window-size=1080,800',
            '--start-maximized'
        ]
    });

    const page = await browser.newPage();

    // ✅ Use realistic headers
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );
    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9',
        'upgrade-insecure-requests': '1'
    });

    // ✅ Optional: add random delay to look human
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000));




    // await browser.close();

    console.log("Logged In");
    console.log(Date.now());
}

// Start the scraping process
export {
    autoLogin,
}; 