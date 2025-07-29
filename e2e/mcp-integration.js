/**
 * MCP (Model Context Protocol) Server Integration for Playwright Testing
 * This file provides enhanced testing capabilities and reporting for the insurance quote application
 */

class MCPServerIntegration {
  constructor() {
    this.testResults = [];
    this.serverUrl = process.env.MCP_SERVER_URL || 'http://localhost:3001';
  }

  /**
   * Log test execution details to MCP server
   */
  async logTestExecution(testName, status, duration, screenshot = null) {
    const testData = {
      testName,
      status,
      duration,
      timestamp: new Date().toISOString(),
      screenshot,
      application: 'insurance-quote-calculator'
    };

    this.testResults.push(testData);
    
    // In a real MCP server integration, you would send this to the server
    console.log('MCP Server Log:', JSON.stringify(testData, null, 2));
    
    return testData;
  }

  /**
   * Capture application state for MCP analysis
   */
  async captureApplicationState(page) {
    try {
      const state = {
        url: page.url(),
        title: await page.title(),
        timestamp: new Date().toISOString(),
        viewport: await page.viewportSize(),
        formData: await this.extractFormData(page),
        quoteData: await this.extractQuoteData(page)
      };

      console.log('Application State Captured:', JSON.stringify(state, null, 2));
      return state;
    } catch (error) {
      console.error('Error capturing application state:', error);
      return null;
    }
  }

  /**
   * Extract form data if form is visible
   */
  async extractFormData(page) {
    try {
      const formVisible = await page.locator('.quote-form').isVisible().catch(() => false);
      if (!formVisible) return null;

      const formData = {
        firstName: await page.locator('input[name="firstName"]').inputValue().catch(() => ''),
        lastName: await page.locator('input[name="lastName"]').inputValue().catch(() => ''),
        age: await page.locator('input[name="age"]').inputValue().catch(() => ''),
        vehicleType: await page.locator('select[name="vehicleType"]').inputValue().catch(() => ''),
        coverage: await page.locator('select[name="coverage"]').inputValue().catch(() => ''),
        email: await page.locator('input[name="email"]').inputValue().catch(() => '')
      };

      return formData;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract quote data if quote is visible
   */
  async extractQuoteData(page) {
    try {
      const quoteVisible = await page.locator('.quote-result').isVisible().catch(() => false);
      if (!quoteVisible) return null;

      const customerName = await page.locator('.quote-details p:has-text("Customer:")').textContent().catch(() => '');
      const quoteNumber = await page.locator('.quote-details p:has-text("Quote Number:")').textContent().catch(() => '');
      const premium = await page.locator('.quote-amount').textContent().catch(() => '');

      return {
        customerName: customerName.replace('Customer: ', ''),
        quoteNumber: quoteNumber.replace('Quote Number: ', ''),
        premium: premium.replace('$', '')
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate quote calculation against expected business logic
   */
  validateQuoteCalculation(age, vehicleType, coverage, actualAmount) {
    const basePrice = 500;
    const ageMultiplier = age < 25 ? 1.5 : age > 65 ? 1.2 : 1.0;
    const vehicleMultiplier = vehicleType === 'luxury' ? 1.8 : 
                            vehicleType === 'suv' ? 1.3 : 1.0;
    const coverageMultiplier = coverage === 'comprehensive' ? 1.4 : 
                             coverage === 'collision' ? 1.2 : 1.0;
    
    const expectedAmount = Math.round(basePrice * ageMultiplier * vehicleMultiplier * coverageMultiplier);
    
    return {
      expected: expectedAmount,
      actual: actualAmount,
      isValid: expectedAmount === actualAmount,
      calculation: {
        basePrice,
        ageMultiplier,
        vehicleMultiplier,
        coverageMultiplier
      }
    };
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.status === 'passed').length;
    const failedTests = totalTests - passedTests;
    const averageDuration = this.testResults.reduce((sum, test) => sum + (test.duration || 0), 0) / totalTests;

    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: ((passedTests / totalTests) * 100).toFixed(2) + '%',
        averageDuration: Math.round(averageDuration) + 'ms'
      },
      tests: this.testResults,
      generatedAt: new Date().toISOString(),
      mcpServerIntegration: {
        enabled: true,
        version: '1.0.0',
        capabilities: [
          'test-execution-logging',
          'application-state-capture',
          'quote-calculation-validation',
          'comprehensive-reporting'
        ]
      }
    };

    console.log('=== MCP Server Test Report ===');
    console.log(JSON.stringify(report, null, 2));
    
    return report;
  }

  /**
   * Reset test results
   */
  reset() {
    this.testResults = [];
  }
}

module.exports = { MCPServerIntegration };