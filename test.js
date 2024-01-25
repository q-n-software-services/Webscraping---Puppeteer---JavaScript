// Importing Libraries
const puppeteer = require('puppeteer');
const fs = require('fs');
const { get } = require('http');

// Function to get data for a single phone, i.e. to scrape the phone data page
const phoneData = async (url3) => {
    url3 = url3.trim();
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
    try {
        let allImages = singleTweet12.split('href="')[1].split('"')[0]
        allImages = 'https://www.gsmarena.com/' + allImages
        myData['All Images'] = allImages;
    } catch {
        console.log(' ');
    }

    try {
        singleTweet12 = singleTweet12.split('src="')[1]
        let image = singleTweet12.split('"')[0];
        myData['Image'] = image;
    } catch {
        console.log(' ')
    }




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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let links = ' ';

(async () => {

    let data = fs.readFileSync('phoneLinks.txt', 'utf8');
    links = data.toString();
    links = links.split("\n")
    // console.log(links);
    // console.log(typeof links)
    // console.log(links.length)

    let a = ' ';
    let i = 1;
    for (let url of links) {
        await phoneData(url);
        console.log(i);
        i += 1;
        if (i > 800) {
            sleep(3600000).then(() => { console.log(' ') });
        }
    }



})();


