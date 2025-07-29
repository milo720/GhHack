const { test, expect } = require('@playwright/test');
const { MCPServerIntegration } = require('./mcp-integration');

test.describe('Insurance Quote Calculator - MCP Server Enhanced Tests', () => {
  let mcpServer;

  test.beforeAll(async () => {
    mcpServer = new MCPServerIntegration();
  });

  test.afterAll(async () => {
    // Generate final test report
    mcpServer.generateTestReport();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('MCP: Validate complete quote generation flow', async ({ page }) => {
    const startTime = Date.now();
    
    try {
      // Capture initial state
      const initialState = await mcpServer.captureApplicationState(page);
      
      // Fill out form with comprehensive coverage
      await page.fill('input[name="firstName"]', 'Alice');
      await page.fill('input[name="lastName"]', 'Johnson');
      await page.fill('input[name="age"]', '28');
      await page.selectOption('select[name="vehicleType"]', 'suv');
      await page.selectOption('select[name="coverage"]', 'comprehensive');
      await page.fill('input[name="email"]', 'alice.johnson@example.com');
      
      // Capture form state before submission
      const formState = await mcpServer.captureApplicationState(page);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for quote to be generated
      await expect(page.locator('h2')).toContainText('Your Insurance Quote');
      
      // Capture final state with quote
      const quoteState = await mcpServer.captureApplicationState(page);
      
      // Extract quote amount for validation
      const quoteAmountText = await page.locator('.quote-amount').textContent();
      const actualAmount = parseInt(quoteAmountText.replace('$', ''));
      
      // Validate quote calculation using MCP server logic
      const validation = mcpServer.validateQuoteCalculation(28, 'suv', 'comprehensive', actualAmount);
      expect(validation.isValid).toBe(true);
      
      // Verify expected amount: 500 * 1.0 (age 28) * 1.3 (SUV) * 1.4 (comprehensive) = 910
      await expect(page.locator('.quote-amount')).toContainText('$910');
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('complete-quote-generation-flow', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('complete-quote-generation-flow', 'failed', duration);
      throw error;
    }
  });

  test('MCP: Validate quote calculation accuracy for all vehicle types', async ({ page }) => {
    const startTime = Date.now();
    const testCases = [
      { vehicle: 'sedan', multiplier: 1.0, expected: 500 },
      { vehicle: 'suv', multiplier: 1.3, expected: 650 },
      { vehicle: 'luxury', multiplier: 1.8, expected: 900 },
      { vehicle: 'truck', multiplier: 1.0, expected: 500 }
    ];

    try {
      for (const testCase of testCases) {
        // Fill base form
        await page.fill('input[name="firstName"]', 'Test');
        await page.fill('input[name="lastName"]', 'Driver');
        await page.fill('input[name="age"]', '35'); // Base multiplier of 1.0
        await page.selectOption('select[name="vehicleType"]', testCase.vehicle);
        await page.selectOption('select[name="coverage"]', 'liability'); // Base multiplier of 1.0
        await page.fill('input[name="email"]', 'test@example.com');
        
        // Submit and check result
        await page.click('button[type="submit"]');
        
        // Validate quote amount
        await expect(page.locator('.quote-amount')).toContainText(`$${testCase.expected}`);
        
        // Capture state for MCP analysis
        await mcpServer.captureApplicationState(page);
        
        // Reset for next test case
        await page.click('button:has-text("Get New Quote")');
      }
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('vehicle-type-quote-validation', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('vehicle-type-quote-validation', 'failed', duration);
      throw error;
    }
  });

  test('MCP: Validate age-based premium calculations', async ({ page }) => {
    const startTime = Date.now();
    const ageCases = [
      { age: 22, category: 'young', multiplier: 1.5, expected: 750 },
      { age: 35, category: 'standard', multiplier: 1.0, expected: 500 },
      { age: 70, category: 'senior', multiplier: 1.2, expected: 600 }
    ];

    try {
      for (const ageCase of ageCases) {
        // Fill form with varying ages
        await page.fill('input[name="firstName"]', `Driver${ageCase.age}`);
        await page.fill('input[name="lastName"]', ageCase.category);
        await page.fill('input[name="age"]', ageCase.age.toString());
        await page.selectOption('select[name="vehicleType"]', 'sedan');
        await page.selectOption('select[name="coverage"]', 'liability');
        await page.fill('input[name="email"]', `driver${ageCase.age}@example.com`);
        
        await page.click('button[type="submit"]');
        
        // Validate using MCP server calculation
        const quoteAmountText = await page.locator('.quote-amount').textContent();
        const actualAmount = parseInt(quoteAmountText.replace('$', ''));
        
        const validation = mcpServer.validateQuoteCalculation(ageCase.age, 'sedan', 'liability', actualAmount);
        expect(validation.isValid).toBe(true);
        
        await expect(page.locator('.quote-amount')).toContainText(`$${ageCase.expected}`);
        
        // Capture state
        await mcpServer.captureApplicationState(page);
        
        await page.click('button:has-text("Get New Quote")');
      }
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('age-based-premium-validation', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('age-based-premium-validation', 'failed', duration);
      throw error;
    }
  });

  test('MCP: Validate coverage type premium adjustments', async ({ page }) => {
    const startTime = Date.now();
    const coverageCases = [
      { coverage: 'liability', multiplier: 1.0, expected: 500 },
      { coverage: 'collision', multiplier: 1.2, expected: 600 },
      { coverage: 'comprehensive', multiplier: 1.4, expected: 700 }
    ];

    try {
      for (const coverageCase of coverageCases) {
        await page.fill('input[name="firstName"]', 'Coverage');
        await page.fill('input[name="lastName"]', 'Test');
        await page.fill('input[name="age"]', '30');
        await page.selectOption('select[name="vehicleType"]', 'sedan');
        await page.selectOption('select[name="coverage"]', coverageCase.coverage);
        await page.fill('input[name="email"]', `coverage@example.com`);
        
        await page.click('button[type="submit"]');
        
        // Validate calculation
        const quoteAmountText = await page.locator('.quote-amount').textContent();
        const actualAmount = parseInt(quoteAmountText.replace('$', ''));
        
        const validation = mcpServer.validateQuoteCalculation(30, 'sedan', coverageCase.coverage, actualAmount);
        expect(validation.isValid).toBe(true);
        
        await expect(page.locator('.quote-amount')).toContainText(`$${coverageCase.expected}`);
        
        await mcpServer.captureApplicationState(page);
        await page.click('button:has-text("Get New Quote")');
      }
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('coverage-type-premium-validation', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('coverage-type-premium-validation', 'failed', duration);
      throw error;
    }
  });

  test('MCP: Test form validation and error handling', async ({ page }) => {
    const startTime = Date.now();
    
    try {
      // Test empty form submission
      await page.click('button[type="submit"]');
      
      // Form should still be visible (validation prevents submission)
      await expect(page.locator('.quote-form')).toBeVisible();
      await expect(page.locator('.quote-result')).not.toBeVisible();
      
      // Capture state showing validation
      await mcpServer.captureApplicationState(page);
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('form-validation-test', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('form-validation-test', 'failed', duration);
      throw error;
    }
  });

  test('MCP: Test quote number uniqueness and format', async ({ page }) => {
    const startTime = Date.now();
    const quoteNumbers = [];
    
    try {
      // Generate multiple quotes to test uniqueness
      for (let i = 0; i < 3; i++) {
        await page.fill('input[name="firstName"]', `User${i}`);
        await page.fill('input[name="lastName"]', 'Test');
        await page.fill('input[name="age"]', '30');
        await page.selectOption('select[name="vehicleType"]', 'sedan');
        await page.selectOption('select[name="coverage"]', 'liability');
        await page.fill('input[name="email"]', `user${i}@example.com`);
        
        await page.click('button[type="submit"]');
        
        // Extract quote number
        const quoteNumberText = await page.locator('p:has-text("Quote Number:")').textContent();
        const quoteNumber = quoteNumberText.replace('Quote Number: ', '');
        
        // Validate format (should start with INS-)
        expect(quoteNumber).toMatch(/^INS-\d+-\d+$/);
        quoteNumbers.push(quoteNumber);
        
        // Capture state
        await mcpServer.captureApplicationState(page);
        
        if (i < 2) {
          await page.click('button:has-text("Get New Quote")');
        }
      }
      
      // Verify all quote numbers are unique
      const uniqueNumbers = new Set(quoteNumbers);
      expect(uniqueNumbers.size).toBe(quoteNumbers.length);
      
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('quote-number-uniqueness-test', 'passed', duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      await mcpServer.logTestExecution('quote-number-uniqueness-test', 'failed', duration);
      throw error;
    }
  });
});