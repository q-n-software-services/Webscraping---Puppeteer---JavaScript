const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({/*headless:false*/ });
    const page = await browser.newPage();
    await page.goto('https://www.gsmarena.com/samsung_galaxy_f13-11624.php');
    await page.screenshot({ path: 'wiki2.png' });
    // await browser.waitForTarget(() => false)
    const result = await page.evaluate(() => {
        let heading = document.querySelector('.specs-phone-name-title').innerText;
        console.log(heading);
        
        let divData = document.getElementById('specs-list').innerHTML;
        let divData2 = divData.querySelectorAll('th');
        const myList = [...divData2];
        myList.map(h => h.innerText);
        console.log(myList);

        myData = { 'Name': heading };
        myList.forEach(data => myData[data] = {});
        console.log(myData);
        console.log(myData.length);

        let divData3 = divData.querySelectorAll('table');
        console.log(divData3);
        const myList2 = [...divData2];
        console.log(myList2.length);

        myData['Network'] = divData3[0].innerHTML;
        myData['Launch'] = divData3[1].innerHTML;
        myData['Body'] = divData3[2].innerHTML;
        myData['Display'] = divData3[3].innerHTML;
        myData['Platform'] = divData3[4].innerHTML;
        myData['Memory'] = divData3[5].innerHTML;
        myData['Main Camera'] = divData3[6].innerHTML;
        myData['Selfie camera'] = divData3[7].innerHTML;
        myData['Sound'] = divData3[8].innerHTML;
        myData['Comms'] = divData3[9].innerHTML;
        myData['Features'] = divData3[10].innerHTML;
        myData['Battery'] = divData3[11].innerHTML;
        myData['Misc'] = divData3[12].innerHTML;

        myData.forEach(key => {
            if (key != 'Name'){
                let my = data[key].querySelectorAll('td');
                let myList3 = [];
                my.forEach(item => {
                    myList3.push(item.innerText);
                })
                myData[key] = JSON.stringify(myList3);
            }
        })

        return myData
    });
    console.log(result);

    await browser.close();
})();

// If everything works fine uptill here, You may proceed to output this myData array as CSV file


