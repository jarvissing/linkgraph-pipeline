import fs from 'fs/promises';
import { marked } from 'marked';
import { chromium } from 'playwright';

// 1. Define QA rules
const FORBIDDEN_PHRASES = [
    "As an AI language model", 
    "I am an AI", 
    "OpenAI"
];

async function processContent() {
    try {
        console.log('--- STARTING PIPELINE ---');
        
        console.log('1. Reading AI Markdown file...');
        const rawMarkdown = await fs.readFile('./mock-article.md', 'utf-8');

        console.log('2. Running Automated QA Check...');
        for (const phrase of FORBIDDEN_PHRASES) {
            if (rawMarkdown.includes(phrase)) {
                throw new Error(`QA FAILED: Detected forbidden AI phrase: "${phrase}"`);
            }
        }
        
        console.log('3. Converting Markdown to HTML...');
        const htmlContent = marked.parse(rawMarkdown);

        console.log('4. Firing up the browser...');
        // We set headless: false so you can physically watch the automation happen
        // slowMo slows down the actions by 500ms so it doesn't happen too fast to see
        const browser = await chromium.launch({ headless: false, slowMo: 500 });
        const context = await browser.newContext();
        const page = await context.newPage();

        console.log('5. Navigating to dummy CMS Portal...');
        await page.goto('https://the-internet.herokuapp.com/login');

        console.log('6. Automating the login process...');
        await page.locator('#username').fill('tomsmith');
        await page.locator('#password').fill('SuperSecretPassword!');
        await page.locator('button[type="submit"]').click();

        console.log('7. Taking a proof-of-work screenshot...');
        // This simulates verifying the dashboard loaded before we theoretically paste the HTML
        await page.screenshot({ path: 'pipeline-success.png' });

        console.log('✅ Automation Complete! Closing browser.');
        await browser.close();

    } catch (error) {
        console.error('\n❌ PIPELINE HALTED:', error.message);
    }
}

processContent();