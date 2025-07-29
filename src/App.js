import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    vehicleType: '',
    coverage: '',
    email: ''
  });
  const [quote, setQuote] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    
    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          errors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          errors.firstName = 'First name must be at least 2 characters';
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          errors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          errors.lastName = 'Last name must be at least 2 characters';
        }
        break;
      case 'age':
        if (!value) {
          errors.age = 'Age is required';
        } else if (value < 18) {
          errors.age = 'Must be at least 18 years old';
        } else if (value > 100) {
          errors.age = 'Age cannot exceed 100 years';
        }
        break;
      case 'vehicleType':
        if (!value) {
          errors.vehicleType = 'Please select a vehicle type';
        }
        break;
      case 'coverage':
        if (!value) {
          errors.coverage = 'Please select a coverage type';
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      default:
        break;
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Validate field and update errors
    const fieldErrors = validateField(name, value);
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (fieldErrors[name]) {
        newErrors[name] = fieldErrors[name];
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const generateQuote = () => {
    // Generate a test quote based on the form data
    const basePrice = 500;
    const ageMultiplier = formData.age < 25 ? 1.5 : formData.age > 65 ? 1.2 : 1.0;
    const vehicleMultiplier = formData.vehicleType === 'luxury' ? 1.8 : 
                            formData.vehicleType === 'suv' ? 1.3 : 1.0;
    const coverageMultiplier = formData.coverage === 'comprehensive' ? 1.4 : 
                             formData.coverage === 'collision' ? 1.2 : 1.0;
    
    const calculatedQuote = Math.round(basePrice * ageMultiplier * vehicleMultiplier * coverageMultiplier);
    const quoteNumber = `INS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    setQuote({
      amount: calculatedQuote,
      number: quoteNumber,
      name: `${formData.firstName} ${formData.lastName}`
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const allErrors = {};
    Object.keys(formData).forEach(field => {
      const fieldErrors = validateField(field, formData[field]);
      Object.assign(allErrors, fieldErrors);
    });
    
    setValidationErrors(allErrors);
    
    // Only generate quote if no validation errors
    if (Object.keys(allErrors).length === 0) {
      generateQuote();
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      vehicleType: '',
      coverage: '',
      email: ''
    });
    setQuote(null);
    setValidationErrors({});
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Insurance Quote Calculator</h1>
        <p>Get your personalized insurance quote in seconds!</p>
      </header>
      
      <main className="App-main">
        {!quote ? (
          <form onSubmit={handleSubmit} className="quote-form">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={validationErrors.firstName ? 'error' : ''}
                required
              />
              {validationErrors.firstName && <div className="error-message">{validationErrors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={validationErrors.lastName ? 'error' : ''}
                required
              />
              {validationErrors.lastName && <div className="error-message">{validationErrors.lastName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={validationErrors.age ? 'error' : ''}
                min="18"
                max="100"
                required
              />
              {validationErrors.age && <div className="error-message">{validationErrors.age}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type:</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                className={validationErrors.vehicleType ? 'error' : ''}
                required
              >
                <option value="">Select vehicle type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury Car</option>
                <option value="truck">Truck</option>
              </select>
              {validationErrors.vehicleType && <div className="error-message">{validationErrors.vehicleType}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="coverage">Coverage Type:</label>
              <select
                id="coverage"
                name="coverage"
                value={formData.coverage}
                onChange={handleInputChange}
                className={validationErrors.coverage ? 'error' : ''}
                required
              >
                <option value="">Select coverage type</option>
                <option value="liability">Liability Only</option>
                <option value="collision">Collision</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
              {validationErrors.coverage && <div className="error-message">{validationErrors.coverage}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={validationErrors.email ? 'error' : ''}
                required
              />
              {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
            </div>

            <button type="submit" className="submit-btn">Get Quote</button>
          </form>
        ) : (
          <div className="quote-result">
            <h2>Your Insurance Quote</h2>
            <div className="quote-details">
              <p><strong>Customer:</strong> {quote.name}</p>
              <p><strong>Quote Number:</strong> {quote.number}</p>
              <p><strong>Annual Premium:</strong> <span className="quote-amount">${quote.amount}</span></p>
            </div>
            <button onClick={resetForm} className="new-quote-btn">Get New Quote</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
