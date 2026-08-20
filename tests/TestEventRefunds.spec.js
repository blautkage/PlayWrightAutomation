import { test, expect } from '@playwright/test';
import { time } from 'node:console';



    //Login helper
    async function loginAndGoToBooking(page) {
        const email = "da9lco@gmail.com";
        const password = "Pudding1!";
        await page.goto("https://eventhub.rahulshettyacademy.com/");
        await page.getByPlaceholder('you@email.com').fill(email);
        await page.getByLabel('Password').fill(password);
        await page.locator('#login-btn').click();
        await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
    }

    // Validate first characters of booking ref and event title match
    async function validateFirstCharactersMatch(page, bookingSelector) {
    // 1. Read booking ref from the page
    const bookingRefText = await page.locator('span.font-mono.font-bold.text-indigo-600.bg-indigo-50.px-3.py-1.rounded-lg.text-sm').textContent();
    const cleanBookingRef = bookingRefText ? bookingRefText.trim() : '';

    // 2. Read event title from h1
    const eventTitleText = await page.locator('h1.text-2xl.font-bold.text-gray-900').textContent();
    const cleanEventTitle = eventTitleText ? eventTitleText.trim() : '';

    // 3. Extract the first characters
    const firstCharRef = cleanBookingRef.charAt(0);
    const firstCharEvent = cleanEventTitle.charAt(0);

    // 4. Assert validation: first characters are identical
    expect(firstCharRef).toBe(firstCharEvent);
}


    test('Test 1 — Single ticket booking is eligible for refund', async ({ page }) => {

    //Step 1 — Login
    await loginAndGoToBooking(page);

    //Step 2 — Book first event with 1 ticket (default)
    await page.locator('#nav-events').click();
    await expect(page.locator('#event-card').first()).toBeVisible();
    await page.locator('#event-card').nth(0).locator('#book-now-btn').click();
    await page.getByLabel('Full Name*').fill('Daniel Comolli');
    await page.getByLabel('Email*').fill('da9lco@gmail.com');
    await page.getByLabel('Phone Number*').fill('92937653123');
    await page.locator('#confirm-booking').click();
    
    //Step 3 — Navigate to booking detail
    await page.locator('#nav-bookings').click();
    await expect(page).toHaveURL(/bookings/);
    await expect(page.locator('#booking-card').first()).toBeVisible();
    await page.locator('#booking-card').first().locator("text=View Details").click();
    await expect(page.getByRole('heading', { name: 'Booking Information' })).toBeVisible();

    //Step 4 — Validate booking ref
    await validateFirstCharactersMatch(page, '#booking-card');

    //Step 5 — Check refund eligibility
    await page.getByTestId('check-refund-btn').click();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading' })).not.toBeVisible({ timeout: 6_000 });
    
    //Step 6 — Validate result
    await page.locator('#refund-result').waitFor({ state: 'visible' });
    await expect(page.locator('#refund-result')).toHaveText(/Eligible for refund/i);
   
})

test('Test 2 — Group ticket booking is NOT eligible for refund', async ({ page }) => {

    //Step 1 — Login
    await loginAndGoToBooking(page);

    //Step 2 — Book first event with 1 ticket (default)
    await page.locator('#nav-events').click();
    await expect(page.locator('#event-card').first()).toBeVisible();
    await page.locator('#event-card').nth(0).locator('#book-now-btn').click();
    await page.getByRole('button', { name: '+' }).click({ clickCount: 2 });
    await expect(page.locator('#ticket-count')).toHaveText('3');    
    await page.getByLabel('Full Name*').fill('Daniel Comolli');
    await page.getByLabel('Email*').fill('da9lco@gmail.com');
    await page.getByLabel('Phone Number*').fill('92937653123');
    await page.locator('#confirm-booking').click();
    
    //Step 3 — Navigate to booking detail
    await page.locator('#nav-bookings').click();
    await expect(page).toHaveURL(/bookings/);
    await expect(page.locator('#booking-card').first()).toBeVisible();
    await page.locator('#booking-card').first().locator("text=View Details").click();
    await expect(page.getByRole('heading', { name: 'Booking Information' })).toBeVisible();
    
    //Step 4 — Validate booking ref
    await validateFirstCharactersMatch(page, '#booking-card');
    
    //Step 5 — Check refund eligibility
    await page.getByTestId('check-refund-btn').click();
    await expect(page.getByRole('status', { name: 'Loading' })).toBeVisible();
    await expect(page.getByRole('status', { name: 'Loading' })).not.toBeVisible({ timeout: 6_000 });
    
    //Step 6 — Validate result
    await page.locator('#refund-result').waitFor({ state: 'visible' });
    await expect(page.locator('#refund-result')).toHaveText(/NOT eligible for refund/i);

})