const puppeteer = require('puppeteer');
const downloadPdf = require('./download.js');
const readpdfile = require('./readpdf.js')
const fs = require('fs');

let startUrl = 'http://www.ti.com/processors/sitara-arm/am5x-cortex-a15/overview.html';

(async () => {

    console.log("visiting first page ----- " + startUrl);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 900 });
    await page.goto(startUrl, { waitUntil: 'networkidle2', timeout: 0 });
    await page.screenshot({ path: './screenshots/_sitara-arm_AM574x_1.jpg', type: 'jpeg', fullPage: true });

    let tableTitle = await page.evaluate(() => {
        return document.querySelector('h3.ti_table-title p').innerText.trim();
    });

    console.log("table title : " + tableTitle);

    // get table details
    let tableData = await page.evaluate(() => {
        let componentname = {};
        let tableHeader = document.querySelectorAll('table.ti_table thead h4 a');
        tableHeader.forEach((tableh) => {
            componentname[tableh.innerText] = {};
        });

        // return componentname;
        let table = [];
        // get the table elements
        let tableElms = document.querySelectorAll('table.ti_table tbody tr');
        // get the table data
        tableElms.forEach((tablelement) => {

            try {
                componentname[document.querySelector('table.ti_table th:nth-of-type(2) h4 a').innerText][tablelement.querySelector('th').innerText.trim()] =
                    tablelement.querySelector('td:nth-child(2)').innerText.trim();

                componentname[document.querySelector('table.ti_table th:nth-of-type(3) h4 a').innerText][tablelement.querySelector('th').innerText.trim()] =
                    tablelement.querySelector('td:nth-child(3)').innerText.trim();

                componentname[document.querySelector('table.ti_table th:nth-of-type(4) h4 a').innerText][tablelement.querySelector('th').innerText.trim()] =
                    tablelement.querySelector('td:nth-child(4)').innerText.trim();

                componentname[document.querySelector('table.ti_table th:nth-of-type(5) h4 a').innerText][tablelement.querySelector('th').innerText.trim()] =
                    tablelement.querySelector('td:nth-child(5)').innerText.trim();

            } catch (exception) {

            }
        });

        return componentname;
    });

    console.log(tableData);

    var nextPage = await page.evaluate(() => {
        return document.querySelector("table.ti_table th:nth-child(2) h4 a").getAttribute('href');

    });

    console.log("visiting page " + nextPage);
    // visit next page
    await page.goto(nextPage, { waitUntil: 'networkidle2', timeout: 0 });

    let tb2data = await page.evaluate(() => {
        let titles = document.querySelectorAll('table#tblResults th');
        var partsData = [];

        let table2rows = document.querySelectorAll('table#tblResults tbody  tr');
        table2rows.forEach((row) => {
            let partheaders = {};
            var position = 1;
            var rowDetail = row.querySelectorAll('td');
            // iterate each row data
            rowDetail.forEach((rowdata) => {
                partheaders[document.querySelector(`table#tblResults thead th:nth-child(${position})`).innerText.trim()] = rowdata.innerText.trim();
                position++;
            });
            partsData.push(partheaders);
        })
        return partsData;
    });
    console.log(tb2data);

    // still under test
    await page.click('tr#AM5746 a');
    await page.waitForSelector('tr#rstid_AM5746');
    await page.click("tr#rstid_AM5746 ul.pdf li.html a");
    await page.waitForSelector('div.c3 a img');
    await page.screenshot({ path: './screenshots/_sitara-arm_AM574x_2.jpg', type: 'jpeg', fullPage: true });

    var nextPg = await page.evaluate(() => {
        return document.querySelector("tr#rstid_AM5746 ul.pdf li.html a").getAttribute('href');

    });

    console.log("visiting page ----- " + "http:" + nextPg)
    // visit next page
    await page.goto("http:" + nextPg, { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector('ul.pkgOptions')
    await page.click("ul.pkgOptions li a");
    await page.screenshot({ path: './screenshots/_sitara-arm_AM574x_3.jpg', type: 'jpeg', fullPage: true });

    var pdfPage = await page.evaluate(() => {
        return document.querySelector("ul.pkgOptions li a").getAttribute('href');

    });

    console.log('visiting page -------- ' + "http:" + pdfPage);
    await page.setViewport({ width: 1240, height: 657 });

    const pdfLink = "http:" + pdfPage;
    // visit next page
    await page.goto(pdfLink, { waitUntil: 'networkidle2', timeout: 0 });

    await page.screenshot({ path: './screenshots/_sitara-arm_AM574x_4.jpg', type: 'jpeg', fullPage: true });

    let linkarray = await pdfLink.split('/');

    let docName = await linkarray[linkarray.length - 1];
    let deviceNumber = "";
    // check if file already exists
    if (fs.existsSync("./pdfs/" + docName)) {
        deviceNumbers = await readpdfile("./pdfs/" + docName);
        console("file exists in directory");
    } else {
        deviceNumbers = await downloadPdf(pdfLink);
    }

    // results as json and console them 
    let initdata = {
        tableHeader1: tableTitle,
        table1data: tableData,
        table2: tb2data,
        Orderable_Device: deviceNumbers
    }

    console.log(initdata);

    let data = await JSON.stringify(initdata, null, 2);
    await fs.writeFile('./json/am57X.json', data, (err) => {  
    if (err) throw err;
    console.log('Data written to file');
});

})();