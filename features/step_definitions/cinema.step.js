const {Given, When, Then, Before, After, setDefaultTimeout} = require('cucumber'); 
const puppeteer = require('puppeteer');
const { expect } = require('chai');

const commands = require('../../lib/commands.js');
const SeanceData = require('../../lib/utils.js');

setDefaultTimeout(120000); // Set timeout to 2 minutes

Before (async function() {
    const browser = await puppeteer.launch({headless: true, slowMo: 100});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);
    this.browser = browser;
    this.page = page;
    this.seanceData = new SeanceData('','','','','','');
});

After (async function() {
    await this.browser.close();
});

Given("user is on the starting page", async function() {
    return await this.page.goto('https://qamid.tmweb.ru/client/index.php');
});

When("user selects random day", async function() {
    return await commands.selectRandomDay(this.page, this.seanceData);
});

When("user selects open seance", async function() {
    return await commands.selectOpenSeance(this.page, this.seanceData);
});

When("user selects unoccupied seat", async function() {
    return await commands.selectUnoccupiedSeat(this.page, this.seanceData);
});

When("user clicks button 'Забронировать'", async function() {
    return await commands.clickElement(this.page, "button.acceptin-button");
});

When("user clicks button 'Получить код бронирования'", async function() {
    return await commands.clickElement(this.page, "button.acceptin-button[onclick]");
});

When("user navigates to the seance with booked seat", async function() {
    await this.page.goto('https://qamid.tmweb.ru/client/index.php');
    await this.page.waitForSelector('h1');
    await commands.clickElement(this.page, `[data-time-stamp="${this.seanceData.dayTimestamp}"]`);
    return await commands.findAndClickSeance(this.page, this.seanceData.movie, this.seanceData.hall, this.seanceData.time);
});

When("user clicks on the seat that was booked", async function() {
    return await commands.selectOccupiedSeat(this.page);
});

Then("page with title 'Электронный билет' is opened", async function() {
    const actual = await this.page.$eval("h2.ticket__check-title", (link) => link.textContent);
    const expected = "Электронный билет";
    expect(actual).to.include(expected);
});

Then("displayed start time, row and seat are correct", async function() {
    await this.page.waitForSelector('.ticket__details.ticket__start');
    await this.page.waitForSelector('.ticket__details.ticket__chairs');
    const actualTime = await this.page.$eval('.ticket__details.ticket__start', el => el.textContent);
    const actualRowSeat = await this.page.$eval('.ticket__details.ticket__chairs', el => el.textContent);
    expect(actualTime).to.equal(this.seanceData.time);
    expect(actualRowSeat).to.equal(this.seanceData.rowSeat);
});

Then("button 'Забронировать' stays inactive", async function() {
    const isDisabled = await this.page.$eval('button.acceptin-button', btn => btn.disabled);
    expect(isDisabled).to.be.true;
});