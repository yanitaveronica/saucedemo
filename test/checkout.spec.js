import { Builder, By, until, Key } from 'selenium-webdriver';
import { expect } from 'chai';
import log4js from 'log4js';
import fs from 'fs';
import config from "../config.js";
import path from 'path';
const localpath = path.resolve(); // Convert to absolute path
let screenshotPath;

import dotenv from 'dotenv';
dotenv.config();
const url = process.env.BASE_URL;

let driver;

// Configure Log4js
log4js.configure({
    appenders: { file: { type: 'file', filename: 'logs/test.log' } },
    categories: { default: { appenders: ['file'], level: 'debug' } }
});
const logger = log4js.getLogger('default');

const userName = "#user-name";
const password = "#password";
const buttonLogin = "#login-button";
const pageTitle = ".app_logo";
const textItem = ".inventory_item_name";
const textPrice = ".inventory_item_price";
const buttonAddtocart = "#add-to-cart-sauce-labs-backpack";
const badgeshoppingcart = ".shopping_cart_badge";
const buttoncheckout = "#checkout";
const buttoncancel = "#cancel";
const buttoncontinue = "#continue";
const errorMessage = ".error-message-container.error";
const firstname = "#first-name";
const lastname = "#last-name";
const postalcode = "#postal-code";
const title = ".title";
const buttonfinish = "#finish";
const textcomplete = ".complete-header";
const buttonbacktohome = "#back-to-products";

describe("Checkout and Finish Shopping Product", function () {
  this.beforeEach(async () => {
      driver = await new Builder().forBrowser("chrome").build();
      driver.get(url);
      await driver.manage().window().maximize();
  });

  for (const usr of Object.values(config.users)) {
    it("User successfully checkout and finish shopping using user " + usr, async function () {
      try {
        await Loginandco(usr);

        let titles = await driver.findElement(By.css(title));
        let elementText = await titles.getText();
        expect(elementText).to.include('Checkout: Your Information');

        const firstnm = await driver.findElement(By.css(firstname));
        await firstnm.sendKeys('Yanita');

        const lastnm = await driver.findElement(By.css(lastname));
        await lastnm.sendKeys('Vrn');
        
        const pc = await driver.findElement(By.css(postalcode));
        await pc.sendKeys('12345');

        const btncontinue = await driver.findElement(By.css(buttoncontinue));
        await driver.executeScript('arguments[0].click();', btncontinue);

        titles = await driver.findElement(By.css(title));
        elementText = await titles.getText();
        expect(elementText).to.include('Checkout: Overview');

        const txtItem = await driver.findElement(By.css(textItem));
        elementText = await txtItem.getText();
        expect(elementText).to.include('Sauce Labs Backpack');

        const txtPrice = await driver.findElement(By.css(textPrice));
        elementText = await txtPrice.getText();
        expect(elementText).to.include('$29.99');

        const btnfinish = await driver.findElement(By.css(buttonfinish));
        await driver.executeScript('arguments[0].click();', btnfinish);

        titles = await driver.findElement(By.css(title));
        elementText = await titles.getText();
        expect(elementText).to.include('Checkout: Complete!');

        const txtcomplete = await driver.findElement(By.css(textcomplete));
        elementText = await txtcomplete.getText();
        expect(elementText).to.include('Thank you for your order!');

        const btnhome = await driver.findElement(By.css(buttonbacktohome));
        await driver.executeScript('arguments[0].click();', btnhome);

        titles = await driver.findElement(By.css(title));
        elementText = await titles.getText();
        expect(elementText).to.include('Products');
      }
      catch (error) {
        await catchfailed("User successfully checkout and finish shopping using user " + usr, error);

        // Attach the screenshot path to the error for the report
        this.test.ctx.attachments = screenshotPath;

        throw error; // Re-throw the error to ensure the test is marked as failed
      }
    });
  }

  it("Failed empty data shipping", async function () {
    try {
      await Loginandco(config.users.standardUser);
      
      let titles = await driver.findElement(By.css(title));
      let elementText = await titles.getText();
      expect(elementText).to.include('Checkout: Your Information');

      //empty first name, last name, postal code
      const btncontinue = await driver.findElement(By.css(buttoncontinue));
      await driver.executeScript('arguments[0].click();', btncontinue);

      let errMesg = await driver.findElement(By.css(errorMessage));
      elementText = await errMesg.getText();
      expect(elementText).to.include('Error: First Name is required');

      const lastnm = await driver.findElement(By.css(lastname));
      const firstnm = await driver.findElement(By.css(firstname));

      //empty first name
      await lastnm.sendKeys('Vrn');
      await driver.executeScript('arguments[0].click();', btncontinue);

      errMesg = await driver.findElement(By.css(errorMessage));
      elementText = await errMesg.getText();
      expect(elementText).to.include('Error: First Name is required');

      //empty postal code
      await firstnm.sendKeys('Yanita');
      await driver.executeScript('arguments[0].click();', btncontinue);

      errMesg = await driver.findElement(By.css(errorMessage));
      elementText = await errMesg.getText();
      expect(elementText).to.include('Error: Postal Code is required');

      //empty last name
      await lastnm.click();
      await lastnm.sendKeys(Key.END, Key.chord(Key.SHIFT, Key.HOME), Key.BACK_SPACE);

      await driver.executeScript('arguments[0].click();', btncontinue);

      errMesg = await driver.findElement(By.css(errorMessage));
      elementText = await errMesg.getText();
      expect(elementText).to.include('Error: Last Name is required');
    }
    catch (error) {
      await catchfailed("Failed empty data shipping", error);

      // Attach the screenshot path to the error for the report
      this.test.ctx.attachments = screenshotPath;

      throw error; // Re-throw the error to ensure the test is marked as failed
    }
  });

  it("Cancel checkout your information", async function () {
    try {
      await Loginandco(config.users.standardUser);

      let titles = await driver.findElement(By.css(title));
      let elementText = await titles.getText();
      expect(elementText).to.include('Checkout: Your Information');

      const btncontinue = await driver.findElement(By.css(buttoncontinue));
      await driver.executeScript('arguments[0].click();', btncontinue);

      const btncancel = await driver.findElement(By.css(buttoncancel));
      await driver.executeScript('arguments[0].click();', btncancel);
      
      titles = await driver.findElement(By.css(title));
      elementText = await titles.getText();
      expect(elementText).to.include('Your Cart');
    }
    catch (error) {
      await catchfailed("Cancel checkout your information", error);

      // Attach the screenshot path to the error for the report
      this.test.ctx.attachments = screenshotPath;
  
      throw error; // Re-throw the error to ensure the test is marked as failed
    }
  });

  it("Cancel checkout overview", async function () {
    try {
      await Loginandco(config.users.standardUser);

      let titles = await driver.findElement(By.css(title));
      let elementText = await titles.getText();
      expect(elementText).to.include('Checkout: Your Information');

      const btncontinue = await driver.findElement(By.css(buttoncontinue));
      await driver.executeScript('arguments[0].click();', btncontinue);

      const firstnm = await driver.findElement(By.css(firstname));
      await firstnm.sendKeys('Yanita');
      const lastnm = await driver.findElement(By.css(lastname));
      await lastnm.sendKeys('Vrn');
      const pc = await driver.findElement(By.css(postalcode));
      await pc.sendKeys('12345');

      await driver.executeScript('arguments[0].click();', btncontinue);

      const btncancel = await driver.findElement(By.css(buttoncancel));
      await driver.executeScript('arguments[0].click();', btncancel);

      titles = await driver.findElement(By.css(title));
      elementText = await titles.getText();
      expect(elementText).to.include('Products');
    }
    catch (error) {
      await catchfailed("Cancel checkout overview", error);

      // Attach the screenshot path to the error for the report
      this.test.ctx.attachments = screenshotPath;

      throw error; // Re-throw the error to ensure the test is marked as failed
    }
  });

  afterEach(async () => {
    await driver.quit();
  });
});

async function Loginandco(usr) {
  const usernamefield = await driver.findElement(By.css(userName));
  const passfield = await driver.findElement(By.css(password));
  const buttons = await driver.findElement(By.css(buttonLogin));

  await usernamefield.sendKeys(usr);
  await passfield.sendKeys(config.password);
  await driver.executeScript('arguments[0].click();', buttons);

  let pagetitle = await driver.findElement(By.css(pageTitle));
  let elementText = await pagetitle.getText();
  expect(elementText).to.include('Swag Labs');

  let txtItem = await driver.findElement(By.css(textItem));
  elementText = await txtItem.getText();
  expect(elementText).to.include('Sauce Labs Backpack');

  let txtPrice = await driver.findElement(By.css(textPrice));
  elementText = await txtPrice.getText();
  expect(elementText).to.include('$29.99');

  const btnaddtocart = await driver.findElement(By.css(buttonAddtocart));
  await driver.executeScript('arguments[0].click();', btnaddtocart);

  const badgecart = await driver.findElement(By.css(badgeshoppingcart));
  await driver.wait(until.elementIsVisible(badgecart), 10000);
  await driver.executeScript('arguments[0].click();', badgecart);

  txtItem = await driver.findElement(By.css(textItem));
  elementText = await txtItem.getText();
  expect(elementText).to.include('Sauce Labs Backpack');

  txtPrice = await driver.findElement(By.css(textPrice));
  elementText = await txtPrice.getText();
  expect(elementText).to.include('$29.99');

  const btnco = await driver.findElement(By.css(buttoncheckout));
  await driver.executeScript('arguments[0].click();', btnco);
}

async function catchfailed(tc, error){
  logger.error('Test failed: ', error);

  // Capture a screenshot if the test fails
  const screenshot = await driver.takeScreenshot();
  screenshotPath = localpath + `/screenshot/failed_${tc+Date.now()}.png`;
  fs.writeFileSync(screenshotPath, screenshot, 'base64');
  logger.info(`Screenshot saved: ${screenshotPath}`);

  return screenshotPath
}
