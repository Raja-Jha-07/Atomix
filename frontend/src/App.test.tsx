import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test component
const TestComponent: React.FC = () => {
  return <div>Test Component</div>;
};

describe('Basic Tests', () => {
  test('renders test component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('basic math test', () => {
    expect(2 + 2).toBe(4);
  });

  test('string test', () => {
    expect('Atomix').toContain('Atomix');
  });
}); 