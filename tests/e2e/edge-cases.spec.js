import { test, expect } from '@playwright/test';

/**
 * Mobile and Responsive Tests for Insurance Quote Calculator
 */

test.describe('Insurance Quote Calculator - Mobile Responsiveness', () => {
  
  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify page loads properly on mobile
    await expect(page.locator('h1')).toContainText('Insurance Quote Calculator');
    
    // Verify form elements are visible and usable
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('select[name="vehicleType"]')).toBeVisible();
    
    // Test form interaction on mobile
    await page.fill('input[name="firstName"]', 'Mobile');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="age"]', '25');
    await page.selectOption('select[name="vehicleType"]', 'sedan');
    await page.selectOption('select[name="coverage"]', 'liability');
    await page.fill('input[name="email"]', 'mobile@example.com');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify quote displays properly on mobile
    await expect(page.locator('h2')).toContainText('Your Insurance Quote');
    await expect(page.locator('.quote-amount')).toBeVisible();
  });

  test('should handle form layout on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify all form elements are accessible
    const formElements = [
      'input[name="firstName"]',
      'input[name="lastName"]', 
      'input[name="age"]',
      'select[name="vehicleType"]',
      'select[name="coverage"]',
      'input[name="email"]',
      'button[type="submit"]'
    ];

    for (const element of formElements) {
      await expect(page.locator(element)).toBeVisible();
    }
  });

});

test.describe('Insurance Quote Calculator - Edge Cases and Error Handling', () => {

  test('should handle complex quote calculations correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test complex scenario: young driver, luxury car, comprehensive coverage
    await page.fill('input[name="firstName"]', 'Complex');
    await page.fill('input[name="lastName"]', 'Case');
    await page.fill('input[name="age"]', '22'); // 1.5x multiplier
    await page.selectOption('select[name="vehicleType"]', 'luxury'); // 1.8x multiplier
    await page.selectOption('select[name="coverage"]', 'comprehensive'); // 1.4x multiplier
    await page.fill('input[name="email"]', 'complex@example.com');
    
    await page.click('button[type="submit"]');
    
    // Expected calculation: 500 * 1.5 * 1.8 * 1.4 = 1890
    await expect(page.locator('.quote-amount')).toContainText('$1890');
  });

  test('should handle boundary age values correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test minimum age (18)
    await fillFormAndSubmit(page, {
      firstName: 'Min',
      lastName: 'Age',
      age: '18',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'min@example.com'
    });
    
    // Under 25, should get 1.5x multiplier = $750
    await expect(page.locator('.quote-amount')).toContainText('$750');
    
    // Reset and test exactly 25 (should not get young driver penalty)
    await page.click('button:has-text("Get New Quote")');
    
    await fillFormAndSubmit(page, {
      firstName: 'Exactly',
      lastName: 'TwentyFive',
      age: '25',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'twentyfive@example.com'
    });
    
    // Exactly 25, should get 1.0x multiplier = $500
    await expect(page.locator('.quote-amount')).toContainText('$500');
    
    // Reset and test maximum age (100)
    await page.click('button:has-text("Get New Quote")');
    
    await fillFormAndSubmit(page, {
      firstName: 'Max',
      lastName: 'Age',
      age: '100',
      vehicleType: 'sedan',
      coverage: 'liability',
      email: 'max@example.com'
    });
    
    // Over 65, should get 1.2x multiplier = $600
    await expect(page.locator('.quote-amount')).toContainText('$600');
  });

  test('should test all vehicle type combinations', async ({ page }) => {
    const vehicleTests = [
      { type: 'sedan', expectedMultiplier: 1.0, expectedPrice: '$500' },
      { type: 'truck', expectedMultiplier: 1.0, expectedPrice: '$500' },
      { type: 'suv', expectedMultiplier: 1.3, expectedPrice: '$650' },
      { type: 'luxury', expectedMultiplier: 1.8, expectedPrice: '$900' }
    ];
    
    for (let i = 0; i < vehicleTests.length; i++) {
      if (i > 0) {
        await page.click('button:has-text("Get New Quote")');
      }
      
      await page.goto('/');
      
      const test = vehicleTests[i];
      await fillFormAndSubmit(page, {
        firstName: 'Vehicle',
        lastName: 'Test',
        age: '30', // Standard rate (1.0x)
        vehicleType: test.type,
        coverage: 'liability', // Standard rate (1.0x)
        email: 'vehicle@example.com'
      });
      
      await expect(page.locator('.quote-amount')).toContainText(test.expectedPrice);
    }
  });

  test('should preserve customer information in quote display', async ({ page }) => {
    await page.goto('/');
    
    const testData = {
      firstName: 'Preserve',
      lastName: 'Information',
      age: '35',
      vehicleType: 'suv',
      coverage: 'collision',
      email: 'preserve@example.com'
    };
    
    await fillFormAndSubmit(page, testData);
    
    // Verify customer name is correctly displayed
    await expect(page.locator('p:has-text("Customer:")')).toContainText(`Customer: ${testData.firstName} ${testData.lastName}`);
    
    // Verify quote number format
    const quoteNumberText = await page.locator('p:has-text("Quote Number:")').textContent();
    expect(quoteNumberText).toMatch(/Quote Number: INS-\d{13}-\d{1,3}/);
    
    // Verify calculated amount (500 * 1.0 * 1.3 * 1.2 = 780)
    await expect(page.locator('.quote-amount')).toContainText('$780');
  });

  test('should handle rapid form submissions', async ({ page }) => {
    await page.goto('/');
    
    // Fill form multiple times rapidly and ensure each generates a unique quote
    const quotes = [];
    
    for (let i = 0; i < 3; i++) {
      if (i > 0) {
        await page.click('button:has-text("Get New Quote")');
        // Small delay to ensure different timestamps
        await page.waitForTimeout(100);
      }
      
      await fillFormAndSubmit(page, {
        firstName: `Rapid${i}`,
        lastName: 'Test',
        age: '30',
        vehicleType: 'sedan',
        coverage: 'liability',
        email: `rapid${i}@example.com`
      });
      
      const quoteNumber = await page.locator('p:has-text("Quote Number:")').textContent();
      quotes.push(quoteNumber);
      
      // Verify quote displays
      await expect(page.locator('h2')).toContainText('Your Insurance Quote');
      await expect(page.locator('.quote-amount')).toContainText('$500');
    }
    
    // Ensure all quote numbers are unique
    const uniqueQuotes = new Set(quotes);
    expect(uniqueQuotes.size).toBe(3);
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