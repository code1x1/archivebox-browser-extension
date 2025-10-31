import puppeteer from 'puppeteer';

const extensionPath = './dist';
let extensionId: string | null | undefined = "";
let browser: puppeteer.Browser;


describe("test extension options page", () => {
    beforeAll(async () => {
        browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ]
        });

        const page = await browser.newPage();
        await page.goto('chrome://extensions/');

        await page.evaluate(() => {
            const devModeToggle = document.querySelector<HTMLInputElement>('extensions-manager')
                ?.shadowRoot?.querySelector<HTMLInputElement>('extensions-toolbar')
                ?.shadowRoot?.querySelector<HTMLInputElement>('#devMode');
            if (devModeToggle && !devModeToggle?.checked) {
                devModeToggle?.click();
            }
        });

        extensionId = await page.evaluate(() => {
        const extensionsManager = document.querySelector('extensions-manager');
        const itemsList = extensionsManager?.shadowRoot?.querySelector('extensions-item-list');
        const items = itemsList?.shadowRoot?.querySelectorAll('extensions-item');
        
        if (items && items.length > 0) {
            return items[0]?.id;
        }
        return null;
        });
    })

    it('go to options page', async () => {
        console.log('Extension ID:', extensionId);
        const page = await browser.newPage();
        await page.goto(`chrome-extension://${extensionId}/options.html`);
        const importTab = await page.$("#import-tab");
        await importTab?.click();
    });

    it('open import tab', async () => {
        const page = (await browser.pages()).at(1);
        const bookmarksTab = await page?.$("button#bookmarks-tab");
        await bookmarksTab?.click();
    });
})