const { test, expect } = require('@playwright/test');

test.describe('Insurance Quote Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading and form', async ({ page }) => {
    // Check that the page loads with correct title
    await expect(page).toHaveTitle(/React App/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    
    // Check subtitle
    await expect(page.locator('p')).toContainText('Get your personalized insurance quote in seconds!');
    
    // Verify all form fields are present
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="lastName"]')).toBeVisible();
    await expect(page.locator('input[name="age"]')).toBeVisible();
    await expect(page.locator('select[name="vehicleType"]')).toBeVisible();
    await expect(page.locator('select[name="coverage"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    // Check submit button
    await expect(page.locator('button[type="submit"]')).toContainText('Get Quote');
  });

  test('should generate a quote for liability coverage with sedan', async ({ page }) => {
    // Fill out the form with basic coverage
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify quote results are displayed
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    await expect(page.locator('.quote-details')).toContainText('Customer: John Doe');
    await expect(page.locator('.quote-details')).toContainText('Quote Number: INS-');
    await expect(page.locator('.quote-details')).toContainText('Annual Premium: $500'); // Base price for this combination
    
    // Check that new quote button is present
    await expect(page.locator('button')).toContainText('Get New Quote');
  });

  test('should generate higher quote for luxury car with comprehensive coverage', async ({ page }) => {
    // Fill out the form with expensive options
    await page.fill('input[name="firstName"]', 'Jane');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[name="age"]', '35');
    await page.selectOption('select[name="vehicleType"]', 'luxury');
    await page.selectOption('select[name="coverage"]', 'comprehensive');
    await page.fill('input[name="email"]', 'jane.smith@example.com');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Verify quote results
    await expect(page.locator('.quote-details')).toContainText('Customer: Jane Smith');
    
    // Should be higher than base price: 500 * 1.0 (age) * 1.8 (luxury) * 1.4 (comprehensive) = 1260
    await expect(page.locator('.quote-amount')).toContainText('$1260');
  });

  test('should apply age multiplier for young driver', async ({ page }) => {
    // Fill out form for young driver (under 25)
    await page.fill('input[name="firstName"]', 'Alex');
    await page.fill('input[name="lastName"]', 'Young');
    await page.fill('input[name="age"]', '22');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'alex.young@example.com');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should be higher than base: 500 * 1.5 (young) * 1.0 (sedan) * 1.0 (liability) = 750
    await expect(page.locator('.quote-amount')).toContainText('$750');
  });

  test('should apply age multiplier for senior driver', async ({ page }) => {
    // Fill out form for senior driver (over 65)
    await page.fill('input[name="firstName"]', 'Robert');
    await page.fill('input[name="lastName"]', 'Senior');
    await page.fill('input[name="age"]', '70');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'robert.senior@example.com');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should be higher than base: 500 * 1.2 (senior) * 1.0 (sedan) * 1.0 (liability) = 600
    await expect(page.locator('.quote-amount')).toContainText('$600');
  });

  test('should reset form when Get New Quote is clicked', async ({ page }) => {
    // Fill out and submit form first
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Verify quote is displayed
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    
    // Click new quote button
    await page.click('button:has-text("Get New Quote")');
    
    // Verify form is reset and visible again
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    await expect(page.locator('input[name="firstName"]')).toHaveValue('');
    await expect(page.locator('input[name="lastName"]')).toHaveValue('');
    await expect(page.locator('input[name="age"]')).toHaveValue('');
    await expect(page.locator('select[name="vehicleType"]')).toHaveValue('');
    await expect(page.locator('select[name="coverage"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
  });

  test('should require all fields to be filled', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Form should not submit (page should still show form)
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
  });

  test('should validate age input constraints', async ({ page }) => {
    const ageInput = page.locator('input[name="age"]');
    
    // Check min attribute
    await expect(ageInput).toHaveAttribute('min', '18');
    
    // Check max attribute  
    await expect(ageInput).toHaveAttribute('max', '100');
    
    // Check type
    await expect(ageInput).toHaveAttribute('type', 'number');
  });

  test('should validate email input type', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    
    // Check type attribute
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should have proper select options', async ({ page }) => {
    // Check vehicle type options
    const vehicleSelect = page.locator('select[name="vehicleType"]');
    await expect(vehicleSelect.locator('option[value="sedan"]')).toContainText('Sedan');
    await expect(vehicleSelect.locator('option[value="suv"]')).toContainText('SUV');
    await expect(vehicleSelect.locator('option[value="luxury"]')).toContainText('Luxury Car');
    await expect(vehicleSelect.locator('option[value="truck"]')).toContainText('Truck');
    
    // Check coverage type options
    const coverageSelect = page.locator('select[name="coverage"]');
    await expect(coverageSelect.locator('option[value="liability"]')).toContainText('Liability Only');
    await expect(coverageSelect.locator('option[value="collision"]')).toContainText('Collision');
    await expect(coverageSelect.locator('option[value="comprehensive"]')).toContainText('Comprehensive');
  });

  test('should generate unique quote numbers', async ({ page }) => {
    // Generate first quote
    await page.fill('input[name="firstName"]', 'First');
    await page.fill('input[name="lastName"]', 'Quote');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'first@example.com');
    await page.click('button[type="submit"]');
    
    // Get first quote number
    const firstQuoteNumber = await page.locator('p:has-text("Quote Number:")').textContent();
    
    // Reset and generate second quote
    await page.click('button:has-text("Get New Quote")');
    await page.fill('input[name="firstName"]', 'Second');
    await page.fill('input[name="lastName"]', 'Quote');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'second@example.com');
    await page.click('button[type="submit"]');
    
    // Get second quote number
    const secondQuoteNumber = await page.locator('p:has-text("Quote Number:")').textContent();
    
    // Quote numbers should be different
    expect(firstQuoteNumber).not.toBe(secondQuoteNumber);
  });
});