# Playwright MCP Server Testing Documentation

This document describes the Playwright MCP (Model Context Protocol) server testing setup for the Insurance Quote Calculator application.

## Overview

The testing setup includes:

1. **Standard Playwright E2E Tests** - Basic end-to-end functionality testing
2. **MCP Server Integration** - Enhanced testing with intelligent state capture and validation
3. **Comprehensive Test Coverage** - Tests for all application features and edge cases

## Setup

### Prerequisites
- Node.js 14+
- npm
- Chrome browser (automatically detected)

### Installation
```bash
npm install
npm install --save-dev @playwright/test playwright
```

### Configuration
The Playwright configuration is in `playwright.config.js` with the following features:
- Uses system Chrome browser
- Starts React development server automatically
- Configured for headless testing
- HTML test reporting
- Trace collection on test failures

## Test Structure

### Basic E2E Tests (`e2e/insurance-quote.spec.js`)
- Form rendering and validation
- Quote generation with different parameters
- Age-based premium calculations
- Vehicle type multipliers
- Coverage type multipliers
- Form reset functionality
- Input validation
- Quote number uniqueness

### MCP Server Enhanced Tests (`e2e/mcp-enhanced.spec.js`)
- Intelligent application state capture
- Business logic validation
- Enhanced test reporting
- Quote calculation verification
- Comprehensive test analytics

## MCP Server Integration Features

### State Capture
The MCP server integration automatically captures:
- Application URL and title
- Viewport dimensions
- Form data (when form is visible)
- Quote data (when quote is displayed)
- Timestamp information

### Quote Calculation Validation
Validates quotes against the business logic:
- Base price: $500
- Age multipliers:
  - Under 25: 1.5x
  - Over 65: 1.2x
  - 25-65: 1.0x
- Vehicle multipliers:
  - Luxury: 1.8x
  - SUV: 1.3x
  - Sedan/Truck: 1.0x
- Coverage multipliers:
  - Comprehensive: 1.4x
  - Collision: 1.2x
  - Liability: 1.0x

### Test Reporting
Generates comprehensive reports including:
- Test execution summaries
- Success rates
- Average execution times
- Application state snapshots
- MCP server capabilities

## Running Tests

### All Tests
```bash
npm run test:e2e
```

### Specific Test Pattern
```bash
npm run test:e2e -- --grep "pattern"
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Headed Mode (visible browser)
```bash
npm run test:e2e:headed
```

### Examples
```bash
# Run only MCP enhanced tests
npm run test:e2e -- --grep "MCP:"

# Run only quote calculation tests
npm run test:e2e -- --grep "quote"

# Run specific test
npm run test:e2e -- --grep "should display the main heading"
```

## Test Coverage

### Core Functionality
- ✅ Application loading and rendering
- ✅ Form field validation
- ✅ Quote generation
- ✅ Quote calculation accuracy
- ✅ Form reset functionality

### Business Logic
- ✅ Age-based pricing (young, standard, senior)
- ✅ Vehicle type pricing (sedan, SUV, luxury, truck)
- ✅ Coverage type pricing (liability, collision, comprehensive)
- ✅ Quote number generation and uniqueness

### MCP Server Features
- ✅ Application state capture
- ✅ Test execution logging
- ✅ Quote calculation validation
- ✅ Comprehensive reporting
- ✅ Enhanced test analytics

## MCP Server API

### MCPServerIntegration Class Methods

#### logTestExecution(testName, status, duration, screenshot)
Logs test execution details for analysis.

#### captureApplicationState(page)
Captures current application state including form and quote data.

#### validateQuoteCalculation(age, vehicleType, coverage, actualAmount)
Validates quote calculations against business logic.

#### generateTestReport()
Generates comprehensive test execution report.

## Example Test Output

```json
{
  "summary": {
    "totalTests": 17,
    "passedTests": 17,
    "failedTests": 0,
    "successRate": "100.00%",
    "averageDuration": "523ms"
  },
  "mcpServerIntegration": {
    "enabled": true,
    "version": "1.0.0",
    "capabilities": [
      "test-execution-logging",
      "application-state-capture", 
      "quote-calculation-validation",
      "comprehensive-reporting"
    ]
  }
}
```

## Troubleshooting

### Common Issues
1. **Port 3000 already in use**: Ensure the React dev server is running or update the configuration
2. **Browser not found**: The setup uses system Chrome - ensure it's installed
3. **Test timeouts**: Increase timeout values in playwright.config.js if needed

### Debug Mode
Run tests with debug mode for interactive debugging:
```bash
npm run test:e2e -- --debug
```

## Future Enhancements

Potential improvements for the MCP server integration:
- Screenshot capture on test failures
- Performance metrics collection
- Visual regression testing
- API response validation
- Database state verification
- Cross-browser testing automation