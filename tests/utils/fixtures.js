const base = require('@playwright/test');
const { APiUtils } = require('./APiUtils.js');
const {request} = require('@playwright/test');

const loginPayload = {userEmail: "da9lco@gmail.com", userPassword: "Pudding1!"};
const orderPayload = {orders: [{country: "Norway", productOrderedId: "6960eac0c941646b7a8b3e68"}]};

exports.customtest = base.test.extend({
    authenticatedPage: async ({browser}, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto("https://rahulshettyacademy.com/client");
        await page.locator("#userEmail").fill("da9lco@gmail.com");
        await page.locator("#userPassword").fill("Pudding1!");
        await page.locator("#login").click();
        await page.waitForLoadState('networkidle');
        
        await use(page);
    },

    createOrder: async ({}, use) => {
        const apiContext = await request.newContext();
        const apiUtils = new APiUtils(apiContext, loginPayload);
        const response = await apiUtils.createOrder(orderPayload);
        await use(response);
    }
})
