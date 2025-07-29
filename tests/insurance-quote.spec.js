const { test, expect } = require('@playwright/test');

test.describe('Insurance Quote Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the insurance quote calculator page', async ({ page }) => {
    // Check that the page loads with the correct title and heading
    await expect(page).toHaveTitle(/React App/);
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    await expect(page.locator('p')).toContainText('Get your personalized insurance quote in seconds!');
  });

  test('should display all form fields', async ({ page }) => {
    // Verify all form fields are present
    await expect(page.locator('label:text("First Name:")')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    
    await expect(page.locator('label:text("Last Name:")')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    
    await expect(page.locator('label:text("Age:")')).toBeVisible();
    await expect(page.locator('input[name="age"]')).toBeVisible();
    
    await expect(page.locator('label:text("Vehicle Type:")')).toBeVisible();
    await expect(page.locator('select[name="vehicleType"]')).toBeVisible();
    
    await expect(page.locator('label:text("Coverage Type:")')).toBeVisible();
    await expect(page.locator('select[name="coverage"]')).toBeVisible();
    
    await expect(page.locator('label:text("Email Address:")')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    await expect(page.locator('button:text("Get Quote")')).toBeVisible();
  });

  test('should generate a quote with valid form data', async ({ page }) => {
    // Fill out the form with valid data
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'john.doe@example.com');

    // Submit the form
    await page.click('button:text("Get Quote")');

    // Verify the quote is displayed
    await expect(page.locator('h2:text("Your Insurance Quote")')).toBeVisible();
    await expect(page.locator('text=Customer: John Doe')).toBeVisible();
    await expect(page.locator('text=Quote Number:')).toBeVisible();
    await expect(page.locator('text=Annual Premium:')).toBeVisible();
    await expect(page.locator('span.quote-amount')).toContainText('$');
    await expect(page.locator('button:text("Get New Quote")')).toBeVisible();
  });

  test('should calculate correct quote for basic liability coverage', async ({ page }) => {
    // Test with known values to verify calculation
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="age"]', '30'); // Age 30 = 1.0 multiplier
    await page.selectOption('select[name="vehicleType"]', 'sedan'); // Sedan = 1.0 multiplier
    await page.selectOption('select[name="coverage"]', 'liability'); // Liability = 1.0 multiplier
    await page.fill('input[name="email"]', 'test@example.com');

    await page.click('button:text("Get Quote")');

    // Base price is $500, all multipliers are 1.0, so result should be $500
    await expect(page.locator('span.quote-amount')).toContainText('$500');
  });

  test('should calculate higher quote for young driver with luxury car', async ({ page }) => {
    // Test with higher risk profile
    await page.fill('input[name="firstName"]', 'Young');
    await page.fill('input[name="lastName"]', 'Driver');
    await page.fill('input[name="age"]', '22'); // Age < 25 = 1.5 multiplier
    await page.selectOption('select[name="vehicleType"]', 'luxury'); // Luxury = 1.8 multiplier
    await page.selectOption('select[name="coverage"]', 'comprehensive'); // Comprehensive = 1.4 multiplier
    await page.fill('input[name="email"]', 'young@example.com');

    await page.click('button:text("Get Quote")');

    // Base price $500 * 1.5 * 1.8 * 1.4 = $1890
    await expect(page.locator('span.quote-amount')).toContainText('$1890');
  });

  test('should reset form when "Get New Quote" is clicked', async ({ page }) => {
    // Fill out form and get quote
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.click('button:text("Get Quote")');

    // Verify quote is shown
    await expect(page.locator('h2:text("Your Insurance Quote")')).toBeVisible();

    // Click "Get New Quote" button
    await page.click('button:text("Get New Quote")');

    // Verify form is back and fields are empty
    await expect(page.locator('h1:text("Insurance Quote Calculator")')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toHaveValue('');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('');
    await expect(page.locator('input[name="age"]')).toHaveValue('');
    await expect(page.locator('select[name="vehicleType"]')).toHaveValue('');
    await expect(page.locator('select[name="coverage"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
  });

  test('should require all fields to be filled', async ({ page }) => {
    // Try to submit form without filling required fields
    await page.click('button:text("Get Quote")');

    // Form should still be visible (not submitted due to HTML5 validation)
    await expect(page.locator('button:text("Get Quote")')).toBeVisible();
    await expect(page.locator('h2:text("Your Insurance Quote")')).not.toBeVisible();
  });

  test('should enforce age limits', async ({ page }) => {
    // Test minimum age
    await page.fill('input[name="age"]', '17');
    await expect(page.locator('input[name="age"]')).toHaveAttribute('min', '18');
    
    // Test maximum age
    await page.fill('input[name="age"]', '101');
    await expect(page.locator('input[name="age"]')).toHaveAttribute('max', '100');
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid-email');
    
    // The input should have type="email" for browser validation
    await expect(page.locator('input[name="email"]')).toHaveAttribute('type', 'email');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify elements are still visible and accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('button:text("Get Quote")')).toBeVisible();
  });
});