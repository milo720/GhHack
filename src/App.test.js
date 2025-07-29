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
