# Playwright End-to-End Tests

This project includes comprehensive Playwright tests for the Insurance Quote Calculator application.

## Test Coverage

The test suite covers the following functionality:

### Core Features
- ✅ Page loading and basic UI elements
- ✅ Form field validation and requirements
- ✅ Quote generation with valid data
- ✅ Quote calculation accuracy verification
- ✅ Reset functionality ("Get New Quote")

### Form Validation
- ✅ Required field validation
- ✅ Age limits enforcement (18-100)
- ✅ Email format validation

### User Scenarios
- ✅ Basic liability coverage quote calculation
- ✅ High-risk profile (young driver + luxury car + comprehensive coverage)
- ✅ Full user journey from form to quote to reset

### Responsive Design
- ✅ Mobile viewport compatibility

## Running the Tests

### Prerequisites
- Node.js and npm installed
- Chrome browser (uses system Chrome installation)

### Installation
```bash
npm install
```

### Running Tests

#### Run all tests (headless mode):
```bash
npm run test:e2e
```

#### Run tests with UI mode for debugging:
```bash
npm run test:e2e:ui
```

#### Run tests in headed mode:
```bash
npx playwright test --headed
```

#### Run specific test file:
```bash
npx playwright test tests/insurance-quote.spec.js
```

#### Run tests with specific browser:
```bash
npx playwright test --project=chromium
```

### Test Results

Tests generate HTML reports by default. After running tests, you can view the report:
```bash
npx playwright show-report
```

## Test Structure

The main test file is located at `tests/insurance-quote.spec.js` and includes:

1. **Basic Page Load Tests** - Verify the application loads correctly
2. **Form Field Tests** - Ensure all form elements are present and accessible
3. **Quote Generation Tests** - Test the complete user flow
4. **Calculation Accuracy Tests** - Verify quote calculations are correct
5. **Reset Functionality Tests** - Ensure the "Get New Quote" feature works
6. **Validation Tests** - Test form validation rules
7. **Responsive Design Tests** - Verify mobile compatibility

## Configuration

The Playwright configuration is defined in `playwright.config.js` and includes:

- **Base URL**: http://localhost:3000
- **Auto-start dev server**: Tests automatically start the React development server
- **Browser**: Uses system Chrome installation
- **Reports**: HTML reporter for detailed test results
- **Traces**: Enabled on test retry for debugging

## Quote Calculation Test Cases

The tests verify the following calculation scenarios:

### Basic Coverage (Expected: $500)
- Age: 30 (1.0x multiplier)
- Vehicle: Sedan (1.0x multiplier) 
- Coverage: Liability (1.0x multiplier)
- Calculation: $500 × 1.0 × 1.0 × 1.0 = $500

### High-Risk Profile (Expected: $1,890)
- Age: 22 (1.5x multiplier - under 25)
- Vehicle: Luxury car (1.8x multiplier)
- Coverage: Comprehensive (1.4x multiplier)
- Calculation: $500 × 1.5 × 1.8 × 1.4 = $1,890

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**: Stop any running React development server before running tests
2. **Chrome not found**: Ensure Google Chrome is installed on your system
3. **Tests timeout**: Increase timeout in playwright.config.js if needed

### Debug Mode

For debugging failing tests, use the UI mode:
```bash
npm run test:e2e:ui
```

This opens a visual interface where you can step through tests and inspect the application state.