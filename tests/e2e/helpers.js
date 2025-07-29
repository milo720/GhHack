/**
 * Test utilities and helper functions for Playwright tests
 */

/**
 * Fill out the insurance quote form with provided data
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} data - Form data object
 * @param {string} data.firstName - First name
 * @param {string} data.lastName - Last name  
 * @param {string} data.age - Age (as string)
 * @param {string} data.vehicleType - Vehicle type option value
 * @param {string} data.coverage - Coverage type option value
 * @param {string} data.email - Email address
 */
export async function fillQuoteForm(page, data) {
  await page.fill('input[name="firstName"]', data.firstName);
  await page.fill('input[name="lastName"]', data.lastName);
  await page.fill('input[name="age"]', data.age);
  await page.selectOption('select[name="vehicleType"]', data.vehicleType);
  await page.selectOption('select[name="coverage"]', data.coverage);
  await page.fill('input[name="email"]', data.email);
}

/**
 * Submit the quote form
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function submitQuoteForm(page) {
  await page.click('button[type="submit"]');
}

/**
 * Fill form and submit in one action
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} data - Form data object (same as fillQuoteForm)
 */
export async function fillAndSubmitQuoteForm(page, data) {
  await fillQuoteForm(page, data);
  await submitQuoteForm(page);
}

/**
 * Navigate to the quote form (reset from quote view)
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function resetToQuoteForm(page) {
  await page.click('button:has-text("Get New Quote")');
}

/**
 * Calculate expected quote amount based on form data
 * @param {Object} data - Form data object
 * @param {string} data.age - Age as string
 * @param {string} data.vehicleType - Vehicle type
 * @param {string} data.coverage - Coverage type
 * @returns {number} Expected quote amount
 */
export function calculateExpectedQuote(data) {
  const basePrice = 500;
  
  // Age multiplier
  const age = parseInt(data.age);
  const ageMultiplier = age < 25 ? 1.5 : age > 65 ? 1.2 : 1.0;
  
  // Vehicle multiplier  
  const vehicleMultipliers = {
    'sedan': 1.0,
    'truck': 1.0,
    'suv': 1.3,
    'luxury': 1.8
  };
  const vehicleMultiplier = vehicleMultipliers[data.vehicleType] || 1.0;
  
  // Coverage multiplier
  const coverageMultipliers = {
    'liability': 1.0,
    'collision': 1.2,
    'comprehensive': 1.4
  };
  const coverageMultiplier = coverageMultipliers[data.coverage] || 1.0;
  
  return Math.round(basePrice * ageMultiplier * vehicleMultiplier * coverageMultiplier);
}

/**
 * Common test data objects
 */
export const testData = {
  // Standard adult, sedan, liability - baseline $500 quote
  baseline: {
    firstName: 'John',
    lastName: 'Doe',
    age: '30',
    vehicleType: 'sedan',
    coverage: 'liability',
    email: 'john.doe@example.com'
  },
  
  // Young driver - 1.5x age multiplier
  youngDriver: {
    firstName: 'Young',
    lastName: 'Driver',
    age: '22',
    vehicleType: 'sedan',
    coverage: 'liability',
    email: 'young@example.com'
  },
  
  // Senior driver - 1.2x age multiplier
  seniorDriver: {
    firstName: 'Senior',
    lastName: 'Driver',
    age: '70',
    vehicleType: 'sedan',
    coverage: 'liability',
    email: 'senior@example.com'
  },
  
  // Luxury car - 1.8x vehicle multiplier
  luxuryCar: {
    firstName: 'Luxury',
    lastName: 'Owner',
    age: '35',
    vehicleType: 'luxury',
    coverage: 'liability',
    email: 'luxury@example.com'
  },
  
  // Comprehensive coverage - 1.4x coverage multiplier
  comprehensive: {
    firstName: 'Full',
    lastName: 'Coverage',
    age: '40',
    vehicleType: 'sedan',
    coverage: 'comprehensive',
    email: 'full@example.com'
  },
  
  // Complex scenario - multiple multipliers
  complex: {
    firstName: 'Complex',
    lastName: 'Case',
    age: '22', // 1.5x
    vehicleType: 'luxury', // 1.8x
    coverage: 'comprehensive', // 1.4x
    email: 'complex@example.com'
    // Expected: 500 * 1.5 * 1.8 * 1.4 = $1890
  }
};

/**
 * Viewport presets for responsive testing
 */
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 }, 
  desktop: { width: 1280, height: 720 },
  largeDesktop: { width: 1920, height: 1080 }
};