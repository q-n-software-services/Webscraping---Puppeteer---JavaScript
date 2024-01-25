// Importing Libraries
const puppeteer = require('puppeteer');
const fs = require('fs');

// Function to get data for a single phone, i.e. to scrape the phone data page
const phoneData = async (url3) => {
    const browser1 = await puppeteer.launch({
        // headless:false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page1 = await browser1.newPage();
    await page1.goto(url3);
    // await page1.screenshot({ path: 'example.png' });

    // gets name of phone
    const heading = await page1.$$('.specs-phone-name-title');
    const Name = await page1.evaluate(el => el.innerText, heading[0]);

    let myData = { 'Mobile Name': Name, 'URL': url3 };

    const specs = await page1.$$('.specs-brief-accent');
    let specsList = []
    for (const spec of specs) {
        const single = await page1.evaluate(el => el.innerText, spec)
        specsList.push(single)
    }

    // Code to Scrape all the required Info about the phone
    const tweetHandles12 = await page1.$$('.specs-photo-main');
    let singleTweet12 = await page1.evaluate(el12 => el12.innerHTML, tweetHandles12[0])
    singleTweet12 = String(singleTweet12)
    let allImages = singleTweet12.split('href="')[1].split('"')[0]
    allImages = 'https://www.gsmarena.com/' + allImages

    singleTweet12 = singleTweet12.split('src="')[1]
    let image = singleTweet12.split('"')[0];

    myData['Image'] = image;
    myData['All Images'] = allImages;

    myData['Released'] = specsList[0]
    myData['weight'] = specsList[1]
    myData['Operating System'] = specsList[2]
    myData['Storage'] = specsList[3]

    let featureList = []
    const keyFeatures = await page1.$$('.accent');
    for (const feature of keyFeatures) {
        const single3 = await page1.evaluate(el => el.innerText, feature)
        featureList.push(single3)
    }


    let elHandle = await page1.$x('//*[@id="body"]/div/div[1]/div/div[2]/ul/li[4]/div');
    let newdata = await page1.evaluate(el => el.innerText, elHandle[0]);

    myData['Display Size'] = featureList[2]
    myData['Pixels'] = newdata
    myData['Camera MP'] = featureList[3]
    myData['RAM'] = featureList[4]
    myData['Battery Size'] = featureList[5]


    const titles = await page1.$$('.ttl');
    let titlesList = []
    for (const title of titles) {
        const titleValue = await page1.evaluate(el => el.innerText, title)
        titlesList.push(titleValue)
    }

    const infos = await page1.$$('.nfo');
    let infoList = []
    for (const info of infos) {
        const infoValue = await page1.evaluate(el => el.innerText, info)
        infoList.push(infoValue)
    }

    let video = true;
    let features = true;

    // Rearranging the data in a systematic manner after validation
    for (let i = 0; i < infoList.length; i++) {
        if (titlesList[i] == 'Technology') {
            myData['Technology'] = infoList[i]
        } else if (titlesList[i] == 'Announced') {
            myData['Announced'] = infoList[i]
        } else if (titlesList[i] == 'Status') {
            myData['Status'] = infoList[i]
        } else if (titlesList[i] == 'Dimensions') {
            myData['Dimensions'] = infoList[i]
        } else if (titlesList[i] == 'Weight') {
            myData['Weight'] = infoList[i]
        } else if (titlesList[i] == 'Build') {
            myData['Build'] = infoList[i]
        } else if (titlesList[i] == 'SIM') {
            myData['SIM'] = infoList[i]
        } else if (titlesList[i] == 'Type') {
            if (titlesList[i + 1] == 'Charging') {
                myData['Battery Type'] = infoList[i]
            } else {
                myData['Display Type'] = infoList[i]
            }

        } else if (titlesList[i] == 'Size') {
            myData['Display Size'] = infoList[i]
        } else if (titlesList[i] == 'Resolution') {
            myData['Resolution'] = infoList[i]
        } else if (titlesList[i] == 'Protection') {
            myData['Protection'] = infoList[i]
        } else if (titlesList[i] == 'OS') {
            myData['Platform OS'] = infoList[i]
        } else if (titlesList[i] == 'Chipset') {
            myData['Chipset'] = infoList[i]
        } else if (titlesList[i] == 'CPU') {
            myData['CPU'] = infoList[i]
        } else if (titlesList[i] == 'GPU') {
            myData['GPU'] = infoList[i]
        } else if (titlesList[i] == 'Card slot') {
            myData['Memory Card Slot'] = infoList[i]
        } else if (titlesList[i] == 'Internal') {
            myData['Internal'] = infoList[i]
        } else if (titlesList[i] == 'Quad') {
            if (titlesList[i - 1] == 'Video') {
                myData['Selfie Camera'] = infoList[i]
            } else {
                myData['Main Camera'] = infoList[i]
            }
        } else if (titlesList[i] == 'Triple') {
            if (titlesList[i - 1] == 'Video') {
                myData['Selfie Camera'] = infoList[i]
            } else {
                myData['Main Camera'] = infoList[i]
            }
        } else if (titlesList[i] == 'Single') {
            if (titlesList[i - 1] == 'Video') {
                myData['Selfie Camera'] = infoList[i]
            } else {
                myData['Main Camera'] = infoList[i]
            }
        } else if (titlesList[i] == 'Dual') {
            if (titlesList[i - 1] == 'Video') {
                myData['Selfie Camera'] = infoList[i]
            } else {
                myData['Main Camera'] = infoList[i]
            }
        } else if (titlesList[i] == 'Features') {
            if (features == true) {
                myData['Features Main'] = infoList[i]
                features = false
            } else {
                myData['Features Selfie'] = infoList[i]
            }

        } else if (titlesList[i] == 'Video') {
            if (video == true) {
                myData['Video'] = infoList[i]
                video = false
            } else {
                myData['Selfie Camera Video'] = infoList[i]
            }

        } else if (titlesList[i] == 'Loudspeaker') {
            if (titlesList[i - 1] == 'Camera') {
                myData['Loudspeaker Results'] = infoList[i]
            } else {
                myData['Loudspeaker'] = infoList[i]
            }

        } else if (titlesList[i] == '3.5mm jack') {
            myData['3.5mm jack'] = infoList[i]
        } else if (titlesList[i] == 'WLAN') {
            myData['WLAN'] = infoList[i]
        } else if (titlesList[i] == 'Bluetooth') {
            myData['Bluetooth'] = infoList[i]
        } else if (titlesList[i] == 'GPS') {
            myData['GPS'] = infoList[i]
        } else if (titlesList[i] == 'NFC') {
            myData['NFC'] = infoList[i]
        } else if (titlesList[i] == 'Radio') {
            myData['Radio'] = infoList[i]
        } else if (titlesList[i] == 'USB') {
            myData['USB'] = infoList[i]
        } else if (titlesList[i] == 'Sensors') {
            myData['Sensors'] = infoList[i]
        } else if (titlesList[i] == 'Charging') {
            myData['Charging'] = infoList[i]
        } else if (titlesList[i] == 'Colors') {
            myData['Colors'] = infoList[i]
        } else if (titlesList[i] == 'Models') {
            myData['Models'] = infoList[i]
        } else if (titlesList[i] == 'SAR') {
            myData['SAR'] = infoList[i]
        } else if (titlesList[i] == 'SAR EU') {
            myData['SAR EU'] = infoList[i]
        } else if (titlesList[i] == 'Price') {
            myData['Price'] = infoList[i]
        } else if (titlesList[i] == 'Performance') {
            myData['Performance'] = infoList[i]
        } else if (titlesList[i] == 'Display') {
            myData['Display'] = infoList[i]
        } else if (titlesList[i] == 'Camera') {
            myData['Camera'] = infoList[i]
        } else if (titlesList[i] == 'Battery life') {
            myData['Battery life'] = infoList[i]
        } else if (titlesList[i - 1] == 'SIM' && titlesList[i - 2] == 'Build') {
            myData['Water Resistant'] = infoList[i]
        }

    }

    features = true;
    video = true;

    // console.log(myData);
    var size = Object.keys(myData).length;
    // console.log(size);

    // CSV portion starts here onwards

    // Data refinement before saving to CSV file
    let keys = [];
    let rowData = [];
    for (const key in myData) {
        keys.push(key)

        try {
            let a = myData[key];
            let c = a.split('\n');

            d = c.toString();


            b = '';
            for (let letter of d) {
                if (letter != ',') {
                    b += letter
                }
            }

        }
        catch (err) {
            throw err
        }
        rowData.push(b)

    }

    // fs.writeFile('data12.csv', `${keys}\n`, function (err) {
    //     if (err) throw err;
    //     console.log('Saved')
    // })

    // Following command saves data to a CSV file
    fs.appendFile('data12.csv', `${keys}\n${rowData}\n`, function (err) {
        if (err) throw err;
        console.log('Successfully Written')
    })

    await browser1.close();
};

// Scrapes the homepage of the gsmarena.com website to get url to pages of all labelled brands
const brands = async () => {
    const browser2 = await puppeteer.launch({
        // headless:false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page2 = await browser2.newPage();
    await page2.goto('https://www.gsmarena.com/');

    const tweetHandles = await page2.$$('ul');

    let myList = '';
    for (const tweethandle of tweetHandles) {
        const singleTweet = await page2.evaluate(el => el.innerText, tweethandle)
        if (singleTweet.split(' ')[0] === singleTweet) {
            myList += singleTweet + " "
        }

    }

    // Gets the list of all the brands listed
    const links = await page2.$$('li');

    let linksList = [];
    for (const link of links) {
        const text = await page2.evaluate(el => el.innerText, link)
        const mylink = await page2.evaluate(el => el.innerHTML, link)

        if (myList.includes(text)) {
            let temp = 'https://www.gsmarena.com/' + mylink.split('href="')[1].split('"')[0]
            linksList.push(temp)
        }

    }

    console.log(linksList)
    console.log(linksList.length)

    // calls multiplePages function to get the data for all the phones of each brand 

    for (link of linksList) {
        multiplePages(link);
    }

    await browser2.close();
};

// gets the links of all the phones listed at the given webpage
const getPhoneLinks = async (url2) => {
    const browser3 = await puppeteer.launch({
        // headless:false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page3 = await browser3.newPage();
    await page3.goto(url2);

    const html1 = await page3.$$('.makers');
    let html2 = await page3.evaluate(el => el.innerHTML, html1[0]);

    let groupData = String(html2);
    html2 = html2.split('</li>');
    temp2 = html2.pop(-1);
    html2[0] = String(html2[0]).split('\n');
    html2[0] = html2[0][html2[0].length - 1]

    let phoneLinks = [];
    let i = 1;
    for (const data of html2) {
        thisLink = data.split('li><a href="')[1].split('"><img src')[0]
        thisLink = 'https://www.gsmarena.com/' + thisLink
        phoneLinks.push(thisLink);
    }

    await browser3.close();

    return phoneLinks
};

// scrapes all the webpages for the specified brand and gets the URLs of all the listed pages and then calls getPhoneLinks function for all of them
const multiplePages = async (url1) => {
    const browser4 = await puppeteer.launch();
    const page4 = await browser4.newPage();
    await page4.goto(url1, {
        waitUntil: "load"
    });

    let is_disabled = false;
    let phoneLinks = [];

    await page4.waitForSelector('a.pages-next', {visible:true});
    is_disabled = await page4.$('a.disabled.pages-next') !== null;
    await page4.waitForNavigation();
    let importData = '';
    while (!is_disabled) {
        url1 = await page4.url(); 
        
        importData = await getPhoneLinks(url1);
        for (let item of importData) {
            phoneLinks.push(item)
        }
        await page4.waitForSelector('a.pages-next', {visible:true});
        // moves to next page after checking that is this the last page or not
        is_disabled = await page4.$('a.disabled.pages-next') !== null;
        if (!is_disabled){
            // console.log(is_disabled)
            await page4.click('a.pages-next');
            await page4.waitForNavigation();

        }
    }
    // calls phoneData function for all the phones of the given brand to scrape the data for each one of them and save it to a CSV file
    for (let link12 of phoneLinks){
        phoneData(link12);
    }

    console.log(phoneLinks);
    console.log(phoneLinks.length);

    await browser4.close();
};

// calls brands function as being the parent function of all of the other functions
brands();