import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('new-quote');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    vehicleType: '',
    coverage: '',
    email: ''
  });
  const [quote, setQuote] = useState(null);
  const [findQuoteId, setFindQuoteId] = useState('');
  const [findQuoteError, setFindQuoteError] = useState('');
  const [foundQuote, setFoundQuote] = useState(null);

  // Mock data service for finding quotes
  const mockQuotes = {
    'Q123456': {
      id: 'Q123456',
      amount: 750,
      name: 'John Smith',
      vehicleType: 'sedan',
      coverage: 'comprehensive',
      email: 'john.smith@email.com'
    },
    'Q789012': {
      id: 'Q789012',
      amount: 520,
      name: 'Sarah Johnson',
      vehicleType: 'suv',
      coverage: 'collision',
      email: 'sarah.j@email.com'
    },
    'Q345678': {
      id: 'Q345678',
      amount: 890,
      name: 'Mike Davis',
      vehicleType: 'luxury',
      coverage: 'comprehensive',
      email: 'mike.davis@email.com'
    }
  };

  const generateQuoteId = () => {
    // Generate a 7-character quote ID in format Q######
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit number
    return `Q${randomNum}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFindQuoteIdChange = (e) => {
    const value = e.target.value.toUpperCase().slice(0, 7); // Limit to 7 chars and uppercase
    setFindQuoteId(value);
    setFindQuoteError('');
    setFoundQuote(null);
  };

  const validateQuoteId = (quoteId) => {
    if (quoteId.length !== 7) {
      return 'Quote ID must be exactly 7 characters';
    }
    if (!/^[A-Z0-9]+$/.test(quoteId)) {
      return 'Quote ID must contain only letters and numbers';
    }
    return '';
  };

  const findQuote = () => {
    const validationError = validateQuoteId(findQuoteId);
    if (validationError) {
      setFindQuoteError(validationError);
      return;
    }

    const quote = mockQuotes[findQuoteId];
    if (quote) {
      setFoundQuote(quote);
      setFindQuoteError('');
    } else {
      setFindQuoteError('Quote not found. Please check the Quote ID and try again.');
      setFoundQuote(null);
    }
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
    const quoteNumber = generateQuoteId(); // Use new 7-character format
    
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

  const resetFindQuote = () => {
    setFindQuoteId('');
    setFindQuoteError('');
    setFoundQuote(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Insurance Quote Calculator</h1>
        <p>Get your personalized insurance quote in seconds!</p>
      </header>
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'new-quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-quote')}
        >
          Get New Quote
        </button>
        <button 
          className={`tab-button ${activeTab === 'find-quote' ? 'active' : ''}`}
          onClick={() => setActiveTab('find-quote')}
        >
          Find Existing Quote
        </button>
      </div>
      
      <main className="App-main">
        {activeTab === 'new-quote' ? (
          // New Quote Tab Content
          !quote ? (
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
          )
        ) : (
          // Find Quote Tab Content
          <div className="find-quote-container">
            {!foundQuote ? (
              <div className="find-quote-form">
                <h2>Find Existing Quote</h2>
                <p>Enter your 7-character Quote ID to retrieve your existing quote.</p>
                
                <div className="form-group">
                  <label htmlFor="quoteId">Quote ID:</label>
                  <input
                    type="text"
                    id="quoteId"
                    name="quoteId"
                    value={findQuoteId}
                    onChange={handleFindQuoteIdChange}
                    placeholder="e.g., Q123456"
                    className={`quote-id-input ${findQuoteError ? 'error' : ''}`}
                    maxLength="7"
                  />
                  <div className="quote-id-info">
                    <small>Quote ID must be exactly 7 characters (letters and numbers only)</small>
                  </div>
                  {findQuoteError && (
                    <div className="error-message">{findQuoteError}</div>
                  )}
                </div>

                <button 
                  onClick={findQuote} 
                  className="submit-btn"
                  disabled={findQuoteId.length !== 7}
                >
                  Find Quote
                </button>
                
                <div className="sample-quotes">
                  <h3>Try these sample Quote IDs:</h3>
                  <ul>
                    <li>Q123456 - John Smith's comprehensive coverage</li>
                    <li>Q789012 - Sarah Johnson's collision coverage</li>
                    <li>Q345678 - Mike Davis's luxury car coverage</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="quote-result">
                <h2>Found Quote</h2>
                <div className="quote-details">
                  <p><strong>Customer:</strong> {foundQuote.name}</p>
                  <p><strong>Quote Number:</strong> {foundQuote.id}</p>
                  <p><strong>Annual Premium:</strong> <span className="quote-amount">${foundQuote.amount}</span></p>
                  <p><strong>Vehicle Type:</strong> {foundQuote.vehicleType}</p>
                  <p><strong>Coverage Type:</strong> {foundQuote.coverage}</p>
                  <p><strong>Email:</strong> {foundQuote.email}</p>
                </div>
                <button onClick={resetFindQuote} className="new-quote-btn">Find Another Quote</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
