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

test('shows validation errors for invalid input', () => {
  render(<App />);
  
  // Fill out form with invalid data
  fireEvent.change(screen.getByLabelText('First Name:'), { target: { value: 'A' } });
  fireEvent.change(screen.getByLabelText('Age:'), { target: { value: '15' } });
  fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'invalid-email' } });
  
  // Trigger validation by changing focus
  fireEvent.blur(screen.getByLabelText('First Name:'));
  fireEvent.blur(screen.getByLabelText('Age:'));
  fireEvent.blur(screen.getByLabelText('Email Address:'));
  
  // Check for validation error messages
  expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
  expect(screen.getByText('Must be at least 18 years old')).toBeInTheDocument();
  expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
});

test('prevents form submission when validation errors exist', () => {
  render(<App />);
  
  // Try to submit empty form
  fireEvent.click(screen.getByRole('button', { name: /Get Quote/i }));
  
  // Should show validation errors instead of quote
  expect(screen.queryByText(/Your Insurance Quote/i)).not.toBeInTheDocument();
  expect(screen.getByText('First name is required')).toBeInTheDocument();
  expect(screen.getByText('Last name is required')).toBeInTheDocument();
  expect(screen.getByText('Age is required')).toBeInTheDocument();
});
