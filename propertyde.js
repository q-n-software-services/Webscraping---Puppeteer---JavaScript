// Importing Libraries
const puppeteer = require('puppeteer');
const fs = require('fs');
const { get } = require('http');

// Function to get data for a single phone, i.e. to scrape the phone data page
const phoneData = async (url3) => {
    url3 = url3.trim();
    const browser1 = await puppeteer.launch({
        headless:false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page1 = await browser1.newPage();
    await page1.goto(url3);
    // await page1.screenshot({ path: 'example.png' });

    // gets name of phone
    // const btn = await page1.$$('.sc-gsDKAQ .fILFKg');
    // await page1.waitForSelector(".sc-gsDKAQ .fILFKg");
    await page1.waitForSelector('.sc-gsDKAQ .fILFKg', {visible:true});
    await page1.click('.sc-gsDKAQ .fILFKg');

    // const Name = await page1.evaluate(el => el.innerText, heading[0]);

    // // Code to Scrape all the required Info about the phone
    // const tweetHandles12 = await page1.$$('.specs-photo-main');
    // let singleTweet12 = await page1.evaluate(el12 => el12.innerHTML, tweetHandles12[0])
    // singleTweet12 = String(singleTweet12)



    // await browser1.close();
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let url = 'https://www.immowelt.de/';

(async () => {

    let a = ' ';
    let i = 1;

    await phoneData(url);
    // console.log(i);
    // i += 1;
    // if (i > 800) {
    //     sleep(3600000).then(() => { console.log(' ') });
    // }




})();


