import { Builder, By, until } from 'selenium-webdriver';
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
const buttonAddtocart = "#add-to-cart-sauce-labs-backpack";
const buttonRemovecart = "#remove-sauce-labs-backpack"
const badgeshoppingcart = ".shopping_cart_badge"
const buttonremoveoncheckout = "#remove-sauce-labs-backpack";
const buttoncontinueshopping = "#continue-shopping";

describe("Add to cart and remove cart", function () {
    this.beforeEach(async () => {
        driver = await new Builder().forBrowser("chrome").build();
        driver.get(url);
        await driver.manage().window().maximize();
    });

    for (const usr of Object.values(config.users)) {
      it("User successfully add to cart using user " + usr, async function () {
        try {
            await login(usr);

            let txtItem = await driver.findElement(By.css(textItem));
            let elementText = await txtItem.getText();
            expect(elementText).to.include('Sauce Labs Backpack');

            const btnaddtocart = await driver.findElement(By.css(buttonAddtocart));
            await driver.executeScript('arguments[0].click();', btnaddtocart);

            const badgecart = await driver.findElement(By.css(badgeshoppingcart));
            await driver.wait(until.elementIsVisible(badgecart), 10000);
            await driver.executeScript('arguments[0].click();', badgecart);

            txtItem = await driver.findElement(By.css(textItem));
            elementText = await txtItem.getText();
            expect(elementText).to.include('Sauce Labs Backpack');
        }
        catch (error) {
          await catchfailed("User successfully add to cart using user " + usr, error);

          // Attach the screenshot path to the error for the report
          this.test.ctx.attachments = screenshotPath;

          throw error; // Re-throw the error to ensure the test is marked as failed
        }
      });
    }

    for (const usr of Object.values(config.users)) {
      it("User successfully remove add to cart in checkout page using user " + usr , async function () {
        try {
          await login(usr);
          
          let txtItem = await driver.findElement(By.css(textItem));
          let elementText = await txtItem.getText();
          expect(elementText).to.include('Sauce Labs Backpack');

          const btnaddtocart = await driver.findElement(By.css(buttonAddtocart));
          await driver.executeScript('arguments[0].click();', btnaddtocart);

          const badgecart = await driver.findElement(By.css(badgeshoppingcart));
          await driver.wait(until.elementIsVisible(badgecart), 10000);

          const btnremovecart = await driver.findElement(By.css(buttonRemovecart));
          await driver.executeScript('arguments[0].click();', btnremovecart);

          await driver.wait(until.elementIsVisible(driver.findElement(By.css(buttonAddtocart))),10000);
        } 
        catch (error) {
          await catchfailed("User successfully remove add to cart in checkout page using user " + usr, error);

          // Attach the screenshot path to the error for the report
          this.test.ctx.attachments = screenshotPath;

          throw error; // Re-throw the error to ensure the test is marked as failed
        }
      });
    }

    for (const usr of Object.values(config.users)) {
      it("User successfully remove add to cart in checkout page using user " + usr , async function () {
        try {
          await login(usr);

          let txtItem = await driver.findElement(By.css(textItem));
          let elementText = await txtItem.getText();
          expect(elementText).to.include('Sauce Labs Backpack');

          const btnaddtocart = await driver.findElement(By.css(buttonAddtocart));
          await driver.executeScript('arguments[0].click();', btnaddtocart);

          const badgecart = await driver.findElement(By.css(badgeshoppingcart));
          await driver.wait(until.elementIsVisible(badgecart), 10000);
          await driver.executeScript('arguments[0].click();', badgecart);

          txtItem = await driver.findElement(By.css(textItem));
          elementText = await txtItem.getText();
          expect(elementText).to.include('Sauce Labs Backpack');
          
          const btnremovecart = await driver.findElement(By.css(buttonremoveoncheckout));
          await driver.executeScript('arguments[0].click();', btnremovecart);

          const btncontinueshop = await driver.findElement(By.css(buttoncontinueshopping));
          await driver.executeScript('arguments[0].click();', btncontinueshop);

          await driver.wait(until.elementIsVisible(driver.findElement(By.css(buttonAddtocart))),10000);
        }
        catch (error) {
          await catchfailed("User successfully remove add to cart in checkout page using user " + usr, error);

          // Attach the screenshot path to the error for the report
          this.test.ctx.attachments = screenshotPath;

          throw error; // Re-throw the error to ensure the test is marked as failed
        }
      });
    }

    afterEach(async () => {
      await driver.quit();
    });
});

async function login(usr){
  const usernamefield = await driver.findElement(By.css(userName));
  const passfield = await driver.findElement(By.css(password));
  const buttons = await driver.findElement(By.css(buttonLogin));

  await usernamefield.sendKeys(usr);
  await passfield.sendKeys(config.password);
  await driver.executeScript('arguments[0].click();', buttons);

  const pagetitle = await driver.findElement(By.css(pageTitle));
  let elementText = await pagetitle.getText();
  expect(elementText).to.include('Swag Labs');
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