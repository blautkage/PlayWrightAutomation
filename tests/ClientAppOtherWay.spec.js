const {test, expect} = require('@playwright/test');
const { exec } = require('node:child_process');
const { text } = require('node:stream/consumers');




test('@webst Client App Login', async ({page}) =>{
    
    const email = "da9lco@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Pudding1!");
    await page.getByRole("button", { name: "Login" }).click();
    
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    
    
    //Finding and adding Zara Coat 3
    await page.locator(".card-body").filter({hasText: "ZARA COAT 3"}).getByRole("button",{name: "Add To Cart"}).click();
    await page.getByRole("listitem").getByRole("button", { name: "Cart" }).click();
    
    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await page.getByRole("button", { name: "Checkout" }).click();
        
    //Checkout Form
    //|-Country Select
    await page.getByPlaceholder("Select Country").pressSequentially("nor", { delay: 150 });
    
    await page.getByRole("button",{name: "Norway"}).click();
    await page.getByText( "PLACE ORDER" ).click();
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();    

   
 });