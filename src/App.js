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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
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
    generateQuote();
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
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="18"
                max="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type:</label>
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select vehicle type</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury Car</option>
                <option value="truck">Truck</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="coverage">Coverage Type:</label>
              <select
                id="coverage"
                name="coverage"
                value={formData.coverage}
                onChange={handleInputChange}
                required
              >
                <option value="">Select coverage type</option>
                <option value="liability">Liability Only</option>
                <option value="collision">Collision</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
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
