import { test, expect } from '@playwright/test';

test( 'Playwright Special Locators', async ({ page }) => {

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // 5 seconds default timeout for expect assertions --{timeout: 10000} Step level
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({ timeout: 10_000});
    

    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
    
});


test( 'Playwright Test Level Timeout', async ({ page }) => {

    test.setTimeout(60_000); // 30 seconds test level timeout
    const slowExpect = expect.configure({ timeout: 9000 });
    page.setDefaultTimeout(9000);

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();

    // 5 seconds default timeout for expect assertions --{timeout: 10000} Step level
    await slowExpect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible();
    

    await page.getByRole("link",{name : "Shop Name"}).click({timeout: 15_000});
    await slowExpect(page.locator(".my-4").first()).toHaveText("Shop");
    await page.locator("app-card").filter({hasText: 'Nokia Edge'}).getByRole("button").click();
    
});

