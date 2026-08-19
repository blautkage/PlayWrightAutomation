import { test, expect } from '@playwright/test';

test('Test Event Booking', async ({ page }) => {
    
    const email = "da9lco@gmail.com";
    const password = "Pudding1!";

    //Step 1 — Login
    await page.goto("https://eventhub.rahulshettyacademy.com/");
    await page.getByPlaceholder('you@email.com').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.locator('#login-btn').click();
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

    
    //Step 2 — Create a new event
    const eventName = "Test Event" + Date.now();
    await page.getByRole('button', { name: 'Admin' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'Manage Events' }).click();
    await page.locator('#event-title-input').fill(eventName);
    await page.locator('#admin-event-form textarea').fill('This is a test event created by Playwright automation.');
    await page.getByLabel('City*').fill('Birkeland');
    await page.getByLabel('Venue*').fill('Ballhallen, idrettsplassen 1');
    
    // Build tomorrow's date as YYYY-MM-DDT00:00 (e.g. 2026-07-30T00:00)
    const today = new Date()
    today.setDate(today.getDate() + 1);
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const eventDateTime = `${year}-${month}-${day}T00:00`
    const dateInput = page.locator("//input[@id='event-date-&-time']")
    
    await dateInput.waitFor({ state: 'visible' })
    await dateInput.fill(eventDateTime)
    await expect(dateInput).toHaveValue(eventDateTime)
    await page.getByRole('spinbutton', { name: 'Price ($)*' }).click();
    await page.getByRole('spinbutton', { name: 'Price ($)*' }).fill('100');
    await page.getByRole('spinbutton', { name: 'Total Seats*' }).click();
    await page.getByRole('spinbutton', { name: 'Total Seats*' }).fill('50');
    await page.locator("#add-event-btn").click();
    await expect(page.getByText('Event created!')).toBeVisible();
    await expect(page.getByText(eventName)).toBeVisible();

    //Step 3 — Find the event card and capture seats
    await page.locator('#nav-events').click();
    await expect(page.locator('div').filter({ hasText: 'FestivalFeaturedDilli Diwali' }).nth(1)).toBeVisible();
    await page.locator('#event-card').filter({ hasText: eventName }).click();
    await expect(page.getByRole('heading', { name: eventName })).toBeVisible({ timeout: 5_000 });
    const eventCard = page.locator('#event-card').filter({ hasText: eventName });
    const seatLocator = eventCard.locator('text=/seat/i');
    await expect(seatLocator).toHaveText(/50/);

    //Step 4 — Start booking
    await page.locator(`#event-card`).filter({ hasText: eventName }).getByTestId('book-now-btn').click();
    
    //Step 5 — Fill booking form
    await expect(page.getByText('1', { exact: true })).toBeVisible();
    await page.getByRole('textbox', { name: 'Full Name*' }).click();
    await page.getByRole('textbox', { name: 'Full Name*' }).fill('Daniel Comolli');
    await page.getByTestId('customer-email').click();
    await page.getByTestId('customer-email').fill(email);
    await page.getByRole('textbox', { name: 'Phone Number*' }).click();
    await page.getByRole('textbox', { name: 'Phone Number*' }).fill('92937653123');
    await page.getByRole('button', { name: 'Confirm Booking' }).click();
    
    //Step 6 — Verify booking confirmation
    await expect(page.getByRole('heading', { name: 'Booking Confirmed! 🎉' })).toBeVisible();
    await expect(page.locator(".booking-ref.font-mono.font-bold.text-indigo-600").first()).toBeVisible();
    const bookingRef =  await page.locator(".booking-ref.font-mono.font-bold.text-indigo-600").textContent();
    console.log(bookingRef);

    //Step 7 — Verify booking in bookings page
    await page.locator('#nav-bookings').click();
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings');
    await expect(page.getByTestId('booking-card').first()).toBeVisible();
    await expect(page.locator('#booking-card').filter({ hasText: bookingRef }).first()).toBeVisible();
    await expect(page.locator('#booking-card').filter({ hasText: bookingRef }).filter({ hasText: eventName }).first()).toBeVisible();
        
    //Step 8 — Verify seat reduction
    await page.locator('#nav-events').click();
    await expect(page.locator('#event-card').filter({ hasText: eventName })).toBeVisible();
    await expect(eventCard).toBeVisible();
    await expect(page.getByRole('heading', { name: eventName })).toBeVisible();
    await expect(seatLocator).toHaveText(/49/);

})