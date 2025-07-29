# Insurance Quote Calculator

A React-based web application that helps users calculate personalized insurance quotes based on their information.

![Insurance Quote Form](https://github.com/user-attachments/assets/470b8d72-33c5-4d7d-bc3d-422fcdfb5d7f)

## Features

- **User-friendly form** for collecting customer information
- **Real-time quote generation** based on various factors:
  - Age (higher risk for younger and older drivers)
  - Vehicle type (luxury cars and SUVs cost more)
  - Coverage type (comprehensive and collision coverage cost more)
- **Responsive design** that works on desktop and mobile
- **Quote display** with customer details and unique quote number
- **Reset functionality** to generate new quotes

## How to Use

1. Fill out the form with your information:
   - First and Last Name
   - Age (18-100)
   - Vehicle Type (Sedan, SUV, Luxury Car, Truck)
   - Coverage Type (Liability Only, Collision, Comprehensive)
   - Email Address

2. Click "Get Quote" to generate your personalized insurance quote

3. View your quote details including:
   - Customer name
   - Unique quote number
   - Annual premium amount

4. Click "Get New Quote" to start over with a fresh form

![Insurance Quote Result](https://github.com/user-attachments/assets/86422552-04b6-4ed1-9ea6-3c071a1b5e8a)

## Quick Start

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Quote Calculation Logic

The application uses a simple algorithm to calculate insurance quotes:

- **Base Price**: $500
- **Age Multiplier**:
  - Under 25: 1.5x (higher risk)
  - Over 65: 1.2x (slightly higher risk)
  - 25-65: 1.0x (standard rate)
- **Vehicle Multiplier**:
  - Luxury Car: 1.8x
  - SUV: 1.3x
  - Sedan/Truck: 1.0x
- **Coverage Multiplier**:
  - Comprehensive: 1.4x
  - Collision: 1.2x
  - Liability Only: 1.0x

**Final Quote = Base Price × Age Multiplier × Vehicle Multiplier × Coverage Multiplier**

## Technologies Used

- React 18
- CSS3 with Flexbox and Grid
- React Testing Library for unit tests
- Create React App for build tooling

## Testing

The application includes comprehensive testing:

### Unit Tests (React Testing Library)
The application includes unit tests for:
- Component rendering
- Form field validation
- Quote generation functionality
- User interaction flows

Run unit tests with:
```bash
npm test
```

### End-to-End Tests (Playwright)
Comprehensive E2E tests covering:
- Full user journeys
- Form validation
- Quote calculation accuracy
- Reset functionality
- Responsive design

Run E2E tests with:
```bash
npm run test:e2e
```

For more details on E2E testing, see [tests/README.md](tests/README.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request
