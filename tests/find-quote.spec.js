const { test, expect } = require('@playwright/test');

test.describe('Insurance Quote App', () => {
  test('should display tab navigation and switch between tabs', async ({ page }) => {
    await page.goto('/');

    // Check initial state - should be on "Get New Quote" tab
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    await expect(page.locator('.tab-button.active')).toContainText('Get New Quote');
    
    // Check that the new quote form is visible
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    
    // Switch to "Find Existing Quote" tab
    await page.click('button:has-text("Find Existing Quote")');
    
    // Check that the tab switched
    await expect(page.locator('.tab-button.active')).toContainText('Find Existing Quote');
    
    // Check that the find quote form is visible
    await expect(page.locator('input[name="quoteId"]')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Find Existing Quote');
  });

  test('should validate quote ID input', async ({ page }) => {
    await page.goto('/');
    
    // Switch to find quote tab
    await page.click('button:has-text("Find Existing Quote")');
    
    const quoteIdInput = page.locator('input[name="quoteId"]');
    const findButton = page.locator('button:has-text("Find Quote")');
    
    // Initially, find button should be disabled
    await expect(findButton).toBeDisabled();
    
    // Enter less than 7 characters
    await quoteIdInput.fill('Q123');
    await expect(findButton).toBeDisabled();
    
    // Enter exactly 7 characters
    await quoteIdInput.fill('Q123456');
    await expect(findButton).not.toBeDisabled();
    
    // Test input transformation (lowercase to uppercase and length limit)
    await quoteIdInput.fill('q123456789abcd');
    await expect(quoteIdInput).toHaveValue('Q123456');
  });

  test('should find existing quote with valid ID', async ({ page }) => {
    await page.goto('/');
    
    // Switch to find quote tab
    await page.click('button:has-text("Find Existing Quote")');
    
    const quoteIdInput = page.locator('input[name="quoteId"]');
    const findButton = page.locator('button:has-text("Find Quote")');
    
    // Enter a valid quote ID from mock data
    await quoteIdInput.fill('Q123456');
    await findButton.click();
    
    // Verify the quote is found and displayed
    await expect(page.locator('h2')).toContainText('Found Quote');
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Q123456')).toBeVisible();
    await expect(page.getByText('$750')).toBeVisible();
    await expect(page.getByText('sedan')).toBeVisible();
    await expect(page.getByText('comprehensive')).toBeVisible();
    
    // Test "Find Another Quote" button
    await page.click('button:has-text("Find Another Quote")');
    await expect(page.locator('h2')).toContainText('Find Existing Quote');
    await expect(quoteIdInput).toHaveValue('');
  });

  test('should show error for non-existent quote ID', async ({ page }) => {
    await page.goto('/');
    
    // Switch to find quote tab
    await page.click('button:has-text("Find Existing Quote")');
    
    const quoteIdInput = page.locator('input[name="quoteId"]');
    const findButton = page.locator('button:has-text("Find Quote")');
    
    // Enter a non-existent quote ID
    await quoteIdInput.fill('Q999999');
    await findButton.click();
    
    // Verify error message is displayed
    await expect(page.locator('.error-message')).toContainText('Quote not found');
  });

  test('should show validation error for invalid quote ID format', async ({ page }) => {
    await page.goto('/');
    
    // Switch to find quote tab
    await page.click('button:has-text("Find Existing Quote")');
    
    const quoteIdInput = page.locator('input[name="quoteId"]');
    const findButton = page.locator('button:has-text("Find Quote")');
    
    // Enter an invalid format with special characters
    await quoteIdInput.fill('Q123@45');
    await findButton.click();
    
    // Verify validation error is displayed
    await expect(page.locator('.error-message')).toContainText('must contain only letters and numbers');
  });

  test('should generate new quote with 7-character ID', async ({ page }) => {
    await page.goto('/');
    
    // Fill out the new quote form
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="age"]', '30');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Submit the form
    await page.click('button:has-text("Get Quote")');
    
    // Verify quote is generated
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    await expect(page.getByText('Test User')).toBeVisible();
    
    // Check that quote number is in correct format (Q followed by 6 digits)
    const quoteNumberElement = page.locator('p:has-text("Quote Number:")');
    const quoteNumberText = await quoteNumberElement.textContent();
    const quoteNumber = quoteNumberText.replace('Quote Number: ', '');
    expect(quoteNumber).toMatch(/^Q\d{6}$/);
  });

  test('should display sample quote IDs for guidance', async ({ page }) => {
    await page.goto('/');
    
    // Switch to find quote tab
    await page.click('button:has-text("Find Existing Quote")');
    
    // Verify sample quotes section is visible
    await expect(page.locator('.sample-quotes h3')).toContainText('Try these sample Quote IDs');
    await expect(page.getByText('Q123456 - John Smith\'s comprehensive coverage')).toBeVisible();
    await expect(page.getByText('Q789012 - Sarah Johnson\'s collision coverage')).toBeVisible();
    await expect(page.getByText('Q345678 - Mike Davis\'s luxury car coverage')).toBeVisible();
  });
});