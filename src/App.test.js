import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders insurance quote calculator', () => {
  render(<App />);
  const headingElement = screen.getByText(/Insurance Quote Calculator/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders quote form fields', () => {
  render(<App />);
  
  expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
  expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
  expect(screen.getByLabelText('Age:')).toBeInTheDocument();
  expect(screen.getByLabelText('Vehicle Type:')).toBeInTheDocument();
  expect(screen.getByLabelText('Coverage Type:')).toBeInTheDocument();
  expect(screen.getByLabelText('Email Address:')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Get Quote/i })).toBeInTheDocument();
});

test('generates quote when form is submitted', () => {
  render(<App />);
  
  // Fill out the form
  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '30' } });
  fireEvent.change(screen.getByLabelText('Vehicle Type:'), { target: { value: 'sedan' } });
  fireEvent.change(screen.getByLabelText('Coverage Type:'), { target: { value: 'liability' } });
  fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'john@example.com' } });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Get Quote/i }));
  
  // Check that quote is displayed
  expect(screen.getByText(/Your Insurance Quote/i)).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText(/Quote Number:/i)).toBeInTheDocument();
  expect(screen.getByText(/Annual Premium:/i)).toBeInTheDocument();
  expect(screen.getByText(/\$/)).toBeInTheDocument(); // Check for dollar sign
});

// New tests for find quote functionality
test('renders tab navigation', () => {
  render(<App />);
  
  expect(screen.getByRole('button', { name: /Get New Quote/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Find Existing Quote/i })).toBeInTheDocument();
});

test('switches to find quote tab', () => {
  render(<App />);
  
  // Click on Find Existing Quote tab
  fireEvent.click(screen.getByRole('button', { name: /Find Existing Quote/i }));
  
  // Check that find quote form is displayed by looking for the h2 heading specifically
  expect(screen.getByRole('heading', { name: /Find Existing Quote/i, level: 2 })).toBeInTheDocument();
  expect(screen.getByLabelText('Quote ID:')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Find Quote/i })).toBeInTheDocument();
});

test('validates quote ID input', () => {
  render(<App />);
  
  // Switch to find quote tab
  fireEvent.click(screen.getByRole('button', { name: /Find Existing Quote/i }));
  
  const quoteIdInput = screen.getByLabelText('Quote ID:');
  const findButton = screen.getByRole('button', { name: /Find Quote/i });
  
  // Initially the find button should be disabled
  expect(findButton).toBeDisabled();
  
  // Enter less than 7 characters
  fireEvent.change(quoteIdInput, { target: { value: 'Q123' } });
  expect(findButton).toBeDisabled();
  
  // Enter exactly 7 characters
  fireEvent.change(quoteIdInput, { target: { value: 'Q123456' } });
  expect(findButton).not.toBeDisabled();
  
  // Input should be limited to 7 characters and uppercase
  fireEvent.change(quoteIdInput, { target: { value: 'q123456789' } });
  expect(quoteIdInput).toHaveValue('Q123456');
});

test('finds existing quote with valid ID', () => {
  render(<App />);
  
  // Switch to find quote tab
  fireEvent.click(screen.getByRole('button', { name: /Find Existing Quote/i }));
  
  const quoteIdInput = screen.getByLabelText('Quote ID:');
  const findButton = screen.getByRole('button', { name: /Find Quote/i });
  
  // Enter a valid quote ID that exists in mock data
  fireEvent.change(quoteIdInput, { target: { value: 'Q123456' } });
  fireEvent.click(findButton);
  
  // Check that quote is found and displayed
  expect(screen.getByText(/Found Quote/i)).toBeInTheDocument();
  expect(screen.getByText('John Smith')).toBeInTheDocument();
  expect(screen.getByText('Q123456')).toBeInTheDocument();
  expect(screen.getByText(/\$750/)).toBeInTheDocument();
});

test('shows error for non-existent quote ID', () => {
  render(<App />);
  
  // Switch to find quote tab
  fireEvent.click(screen.getByRole('button', { name: /Find Existing Quote/i }));
  
  const quoteIdInput = screen.getByLabelText('Quote ID:');
  const findButton = screen.getByRole('button', { name: /Find Quote/i });
  
  // Enter a non-existent quote ID
  fireEvent.change(quoteIdInput, { target: { value: 'Q999999' } });
  fireEvent.click(findButton);
  
  // Check that error message is displayed
  expect(screen.getByText(/Quote not found/i)).toBeInTheDocument();
});

test('shows error for invalid quote ID format', () => {
  render(<App />);
  
  // Switch to find quote tab
  fireEvent.click(screen.getByRole('button', { name: /Find Existing Quote/i }));
  
  const quoteIdInput = screen.getByLabelText('Quote ID:');
  const findButton = screen.getByRole('button', { name: /Find Quote/i });
  
  // Enter an invalid format (with special characters)
  fireEvent.change(quoteIdInput, { target: { value: 'Q123@45' } });
  fireEvent.click(findButton);
  
  // Check that validation error is displayed
  expect(screen.getByText(/must contain only letters and numbers/i)).toBeInTheDocument();
});

test('generates 7-character quote ID for new quotes', () => {
  render(<App />);
  
  // Fill out the form
  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText('Last Name:'), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '30' } });
  fireEvent.change(screen.getByLabelText('Vehicle Type:'), { target: { value: 'sedan' } });
  fireEvent.change(screen.getByLabelText('Coverage Type:'), { target: { value: 'liability' } });
  fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'john@example.com' } });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Get Quote/i }));
  
  // Check that the generated quote number is 7 characters and starts with Q
  const quoteNumberText = screen.getByText(/Quote Number:/i).closest('p').textContent;
  const quoteNumber = quoteNumberText.replace('Quote Number: ', '');
  expect(quoteNumber).toMatch(/^Q\d{6}$/); // Should be Q followed by 6 digits
});
