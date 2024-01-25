const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({/*headless:false*/});
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Coronavirus');
    await page.screenshot({path: 'wiki.png'});
    // await browser.waitForTarget(() => false)
    const result = await page.evaluate(() => {
        let a = document.querySelectorAll(".mw-headline");
        const headingList = [...a];
        return headingList.map(h => h.innerText)
    });
    console.log(result);

    await browser.close();
})();


