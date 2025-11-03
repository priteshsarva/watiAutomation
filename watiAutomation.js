import puppeteer from "puppeteer";
import { humanizePage } from "./humanize.js";
import "dotenv/config";





const email = process.env.WATI_EMAIL;
const password = process.env.WATI_PASSWORD;
const tenantId = process.env.WATI_TENANT_ID;

async function autoLogin() {

    const browser = await puppeteer.launch({
        headless: process.env.PUPPETEER_HEADLESS === "true",
        // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        defaultViewport: { width: 1080, height: 800 },
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--no-zygote",
            "--window-size=1080,800",
            "--start-maximized",
            '--disable-blink-features=AutomationControlled',
        ],
    });

    const page = await browser.newPage();
    // ✅ Use realistic headers
    await page._client().send('Network.setUserAgentOverride', {
        userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    });

    await page.setExtraHTTPHeaders({
        'accept-language': 'en-US,en;q=0.9',
        'upgrade-insecure-requests': '1',
    });


    await page.goto("https://live.wati.io/login");
    await humanizePage(page, { mouseMoves: 3 });

    console.log("🔑 Attempting automatic login... ");

    // Run your input-filling script INSIDE the browser context.
    await page.evaluate(async (email, password, tenantId) => {

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        function setReactInputValue(el, v) {
            const setter = Object.getOwnPropertyDescriptor(el.__proto__, "value").set; setter.call(el, v);
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        const emaill = document.querySelector('input[name="email"]');
        if (emaill) setReactInputValue(emaill, email);
        await delay(1000);
        const pass = document.querySelector('input[name="password"]');
        if (pass) setReactInputValue(pass, password);
        await delay(1000); const tenant = document.querySelector('input[name="tenantId"]');
        if (tenant) setReactInputValue(tenant, tenantId);
        await delay(1000); const btn = document.querySelector('form button');
        if (btn) btn.click();
    }, email,
        password,
        tenantId);



    // Wait for the navigation that happens after login
    try {
        // await Promise.all([
        //     page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
        //     await delay(1000),
        // ]);

        // await page.waitForSelector('text=Team Inbox', { timeout: 30000 });
        await page.waitForSelector(".filter-description__total-count", { timeout: 60000 });

        const chatCount = await page.evaluate(async () => {
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            await delay(2000)
            return document.querySelector(".filter-description__total-count").textContent
            // return document.querySelector("#root > div")

        });
        console.log("✅ Automatic login successful!");
        console.log(`Chat Count : ${chatCount}`);


    } catch (err) {
        console.log("❌ Automatic login failed.", err.message);
    }

    // Optional: close browser
    // await browser.close();
}

export { autoLogin };
