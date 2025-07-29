# Playwright E2E Tests

This directory contains end-to-end tests for the Insurance Quote Calculator application using Playwright.

## Test Structure

- `insurance-quote.spec.js` - Core functionality tests including form validation, quote generation, and user workflows
- `edge-cases.spec.js` - Edge cases, mobile responsiveness, and comprehensive scenario testing

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

### Test Commands

```bash
# Run all tests (headless)
npm run test:e2e

# Run tests with UI mode (recommended for development)
npm run test:e2e:ui

# Run tests with browser visible (headed mode)
npm run test:e2e:headed

# Run tests in debug mode (step through tests)
npm run test:e2e:debug

# View test reports
npm run test:e2e:report
```

### Running Specific Tests

```bash
# Run only the main insurance quote tests
npx playwright test insurance-quote.spec.js

# Run only the edge cases tests
npx playwright test edge-cases.spec.js

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests on mobile
npx playwright test --project="Mobile Chrome"
```

## Test Coverage

### Core Functionality
- ✅ Application loading and form rendering
- ✅ Form field validation (required fields, input types)
- ✅ Quote generation with various parameters
- ✅ Quote calculation logic verification
- ✅ Form reset functionality
- ✅ Unique quote number generation

### Vehicle Type Testing
- ✅ Sedan (1.0x multiplier) = $500 base
- ✅ Truck (1.0x multiplier) = $500 base  
- ✅ SUV (1.3x multiplier) = $650 base
- ✅ Luxury Car (1.8x multiplier) = $900 base

### Age-Based Testing
- ✅ Under 25 (1.5x multiplier) 
- ✅ 25-65 (1.0x multiplier)
- ✅ Over 65 (1.2x multiplier)
- ✅ Boundary testing (18, 25, 65, 100)

### Coverage Type Testing
- ✅ Liability Only (1.0x multiplier)
- ✅ Collision (1.2x multiplier) 
- ✅ Comprehensive (1.4x multiplier)

### Mobile & Responsive Testing
- ✅ Mobile viewport (375x667)
- ✅ Tablet viewport (768x1024)
- ✅ Form usability on different screen sizes

### Edge Cases
- ✅ Complex calculation scenarios (multiple multipliers)
- ✅ Rapid form submissions
- ✅ Data preservation in quote display
- ✅ Input validation and constraints

## Quote Calculation Formula

The tests verify the following calculation logic:

```
Final Quote = Base Price (500) × Age Multiplier × Vehicle Multiplier × Coverage Multiplier
```

**Age Multipliers:**
- Under 25: 1.5x
- 25-65: 1.0x  
- Over 65: 1.2x

**Vehicle Multipliers:**
- Sedan/Truck: 1.0x
- SUV: 1.3x
- Luxury Car: 1.8x

**Coverage Multipliers:**
- Liability Only: 1.0x
- Collision: 1.2x
- Comprehensive: 1.4x

## Browser Support

Tests run on the following browsers:
- ✅ Chromium (Desktop & Mobile)
- ✅ Firefox (Desktop)
- ✅ WebKit/Safari (Desktop & Mobile)

## CI/CD Integration

The tests are configured to run in CI environments with:
- Automatic retries on failure (2 retries in CI)
- Screenshot and video capture on failure
- HTML test reports
- Parallel execution disabled in CI for stability

## Troubleshooting

### Common Issues

1. **Server not starting**: Ensure the development server is not already running on port 3000
2. **Browser installation**: Run `npx playwright install` if browsers are missing
3. **Port conflicts**: The tests are configured to use port 3001 to avoid conflicts

### Debug Mode

For debugging failing tests:
```bash
npm run test:e2e:debug
```

This will open the Playwright inspector where you can step through tests line by line.