import { test, expect } from '@playwright/test';

/**
 * Insurance Quote Calculator E2E Tests
 * Tests the main user flows of the insurance quote application
 */

test.describe('Insurance Quote Calculator', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('/');
  });

  test('should load the application and display the form', async ({ page }) => {
    // Verify the page title and main heading
    await expect(page).toHaveTitle(/React App/);
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    await expect(page.locator('p:has-text("Get your personalized")')).toContainText('Get your personalized insurance quote in seconds!');

    // Verify all form fields are present
    await expect(page.locator('label:has-text("First Name:")')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Last Name:")')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Age:")')).toBeVisible();
    await expect(page.locator('input[name="age"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Vehicle Type:")')).toBeVisible();
    await expect(page.locator('select[name="vehicleType"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Coverage Type:")')).toBeVisible();
    await expect(page.locator('select[name="coverage"]')).toBeVisible();
    
    await expect(page.locator('label:has-text("Email Address:")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    // Verify submit button is present
    await expect(page.locator('button[type="submit"]')).toContainText('Get Quote');
  });

  test('should validate required form fields', async ({ page }) => {
    // Try to submit form without filling required fields
    await page.click('button[type="submit"]');
    
    // Check that form doesn't submit and we're still on the form view
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    
    // HTML5 validation should prevent submission of empty required fields
    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toHaveAttribute('required');
  });

  test('should generate a quote with valid form data', async ({ page }) => {
    // Fill out the form with test data
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'john.doe@example.com');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify quote is displayed
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    await expect(page.locator('p:has-text("Customer:")')).toContainText('Customer: John Doe');
    await expect(page.locator('p:has-text("Quote Number:")')).toContainText('Quote Number: INS-');
    await expect(page.locator('p:has-text("Annual Premium:")')).toContainText('Annual Premium: $500');
    
    // Verify "Get New Quote" button is present
    await expect(page.locator('button')).toContainText('Get New Quote');
  });

  test('should calculate different quotes for different vehicle types', async ({ page }) => {
    // Test sedan (base price)
    await fillFormAndSubmit(page, {
      firstName: 'John',
      lastName: 'Doe', 
      age: '30',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'john@example.com'
    });
    
    const sedanQuote = await page.locator('.quote-amount').textContent();
    await expect(page.locator('.quote-amount')).toContainText('$500');
    
    // Reset and test luxury car (higher price)
    await page.click('button:has-text("Get New Quote")');
    
    await fillFormAndSubmit(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      age: '30', 
      vehicleType: 'luxury',
      coverage: 'liability',
      email: 'jane@example.com'
    });
    
    // Luxury car should cost more (1.8x multiplier = $900)
    await expect(page.locator('.quote-amount')).toContainText('$900');
  });

  test('should calculate different quotes based on age', async ({ page }) => {
    // Test young driver (under 25, 1.5x multiplier)
    await fillFormAndSubmit(page, {
      firstName: 'Young',
      lastName: 'Driver',
      age: '22',
      vehicleType: 'sedan',
      coverage: 'liability', 
      email: 'young@example.com'
    });
    
    await expect(page.locator('.quote-amount')).toContainText('$750'); // 500 * 1.5
    
    // Reset and test older driver (over 65, 1.2x multiplier)
    await page.click('button:has-text("Get New Quote")');
    
    await fillFormAndSubmit(page, {
      firstName: 'Senior',
      lastName: 'Driver',
      age: '70',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'senior@example.com'
    });
    
    await expect(page.locator('.quote-amount')).toContainText('$600'); // 500 * 1.2
  });

  test('should calculate different quotes based on coverage type', async ({ page }) => {
    // Test comprehensive coverage (1.4x multiplier)
    await fillFormAndSubmit(page, {
      firstName: 'John',
      lastName: 'Doe',
      age: '30',
      vehicleType: 'sedan',
      coverage: 'comprehensive',
      email: 'john@example.com'
    });
    
    await expect(page.locator('.quote-amount')).toContainText('$700'); // 500 * 1.4
    
    // Reset and test collision coverage (1.2x multiplier)  
    await page.click('button:has-text("Get New Quote")');
    
    await fillFormAndSubmit(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      age: '30',
      vehicleType: 'sedan', 
      coverage: 'collision',
      email: 'jane@example.com'
    });
    
    await expect(page.locator('.quote-amount')).toContainText('$600'); // 500 * 1.2
  });

  test('should reset form when "Get New Quote" is clicked', async ({ page }) => {
    // Fill and submit form
    await fillFormAndSubmit(page, {
      firstName: 'John',
      lastName: 'Doe',
      age: '30',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'john@example.com'
    });
    
    // Verify quote is shown
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    
    // Click "Get New Quote"
    await page.click('button:has-text("Get New Quote")');
    
    // Verify we're back to the form and all fields are empty
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    await expect(page.locator('input[name="firstName"]')).toHaveValue('');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('');
    await expect(page.locator('input[name="age"]')).toHaveValue('');
    await expect(page.locator('select[name="vehicleType"]')).toHaveValue('');
    await expect(page.locator('select[name="coverage"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
  });

  test('should generate unique quote numbers', async ({ page }) => {
    // Get first quote
    await fillFormAndSubmit(page, {
      firstName: 'John',
      lastName: 'Doe',
      age: '30',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'john@example.com'
    });
    
    const firstQuoteNumber = await page.locator('p:has-text("Quote Number:")').textContent();
    
    // Reset and get second quote
    await page.click('button:has-text("Get New Quote")');
    await fillFormAndSubmit(page, {
      firstName: 'Jane',
      lastName: 'Smith',
      age: '25',
      vehicleType: 'suv',
      coverage: 'collision',
      email: 'jane@example.com'
    });
    
    const secondQuoteNumber = await page.locator('p:has-text("Quote Number:")').textContent();
    
    // Quote numbers should be different
    expect(firstQuoteNumber).not.toBe(secondQuoteNumber);
    expect(firstQuoteNumber).toMatch(/Quote Number: INS-\d+-\d+/);
    expect(secondQuoteNumber).toMatch(/Quote Number: INS-\d+-\d+/);
  });

  test('should validate age input constraints', async ({ page }) => {
    const ageInput = page.locator('input[name="age"]');
    
    // Verify min and max attributes
    await expect(ageInput).toHaveAttribute('min', '18');
    await expect(ageInput).toHaveAttribute('max', '100');
    await expect(ageInput).toHaveAttribute('type', 'number');
  });

  test('should validate email input type', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    
    // Verify input type is email
    await expect(emailInput).toHaveAttribute('type', 'email');
    await expect(emailInput).toHaveAttribute('required');
  });

});

/**
 * Helper function to fill form and submit
 */
async function fillFormAndSubmit(page, data) {
  await page.fill('input[name="firstName"]', data.firstName);
  await page.fill('input[name="lastName"]', data.lastName);
  await page.fill('input[name="age"]', data.age);
  await page.selectOption('select[name="vehicleType"]', data.vehicleType);
  await page.selectOption('select[name="coverage"]', data.coverage);
  await page.fill('input[name="email"]', data.email);
  await page.click('button[type="submit"]');
}