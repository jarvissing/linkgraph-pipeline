import fs from 'fs/promises';
import { marked } from 'marked';
import { chromium } from 'playwright';

const FORBIDDEN_PHRASES = ["As an AI language model", "I am an AI", "OpenAI"];

async function processContent() {
    try {
        console.log('--- STARTING PIPELINE ---');
        const rawMarkdown = await fs.readFile('./mock-article.md', 'utf-8');

        // QA Check
        for (const phrase of FORBIDDEN_PHRASES) {
            if (rawMarkdown.includes(phrase)) throw new Error(`QA FAILED: Detected: "${phrase}"`);
        }
        
        const htmlContent = marked.parse(rawMarkdown);

        console.log('--- INJECTING INTO CMS ---');
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        // 1. Navigate to the mock CMS
        await page.goto('https://the-internet.herokuapp.com/tinymce');
        
        // 2. Clear the existing dummy text and inject your generated HTML
        // Note: CMS editors often use an iframe; we target that frame directly
        const frame = page.frameLocator('#mce_0_ifr');
        await frame.locator('#tinymce').fill(htmlContent);

        console.log('✅ Content Injected Successfully.');

        // 3. Take a screenshot to prove the HTML was injected
        await page.screenshot({ path: 'final-proof.png' });

        await browser.close();
        console.log('--- PIPELINE FINISHED ---');

    } catch (error) {
        console.error('\n❌ PIPELINE HALTED:', error.message);
    }
}

processContent();