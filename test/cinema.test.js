const commands = require('../lib/commands.js');
const SeanceData = require('../lib/utils.js');

describe("test suite on booking", () => {
    let page;
    let seanceData;

    beforeEach(async() => {
       page = await browser.newPage();
       page.setDefaultNavigationTimeout(120000);
       seanceData = new SeanceData('','','','','','');
       await page.goto('https://qamid.tmweb.ru/client/index.php');
       await page.waitForSelector('h1');
    });

    afterEach(async() => {
        await page.close();
    });

    test("getting e-ticket upon booking a seat", async() => {
        await commands.selectRandomDay(page, seanceData);
        await commands.selectOpenSeance(page, seanceData);
        await commands.selectUnoccupiedSeat(page, seanceData);
        await commands.clickElement(page, "button.acceptin-button");
        await commands.clickElement(page, "button.acceptin-button[onclick]");
        const actual = await page.$eval("h2.ticket__check-title", (link) => link.textContent);
        const expected = "Электронный билет";
        await expect(actual).toContain(expected);
    });

    test("the seats and time info are as expected", async() => {
        await commands.selectRandomDay(page, seanceData);
        await commands.selectOpenSeance(page, seanceData);
        await commands.selectUnoccupiedSeat(page, seanceData);
        await commands.clickElement(page, 'button.acceptin-button');
        await page.waitForSelector('span.ticket__cost');
        const actualTime = await page.$eval('.ticket__details.ticket__start', el => el.textContent);
        const actualRowSeat = await page.$eval('.ticket__details.ticket__chairs', el => el.textContent);
        await expect(actualTime).toEqual(seanceData.time);
        // expect(actualMovie).toEqual(seanceData.movie);
        await expect(actualRowSeat).toEqual(seanceData.rowSeat);
    });

    test("booking is not allowed if the seat has been already booked", async() => {
        //booking a seat so that at least one seat is booked
        await commands.selectRandomDay(page, seanceData);
        await commands.selectOpenSeance(page, seanceData);
        await commands.selectUnoccupiedSeat(page, seanceData);
        await commands.clickElement(page, "button.acceptin-button");
        await commands.clickElement(page, "button.acceptin-button[onclick]");
        //now seat is booked, navigating to the seance
        await page.goto('https://qamid.tmweb.ru/client/index.php');
        await page.waitForSelector('h1');
        await commands.clickElement(page, `[data-time-stamp="${seanceData.dayTimestamp}"]`);
        await commands.findAndClickSeance(page, seanceData.movie, seanceData.hall, seanceData.time);
        await commands.selectOccupiedSeat(page);
        await expect(page.$eval('button.acceptin-button', btn => btn.disabled))
        .resolves.toBe(true);
    });
});
