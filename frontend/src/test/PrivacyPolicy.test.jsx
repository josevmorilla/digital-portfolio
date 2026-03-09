import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';

describe('PrivacyPolicy', () => {
  test('renders the privacy policy page', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText(/Last updated/)).toBeInTheDocument();
  });

  test('renders all section headings', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    expect(screen.getByText('1. Introduction')).toBeInTheDocument();
    expect(screen.getByText('2. Information I Collect')).toBeInTheDocument();
    expect(screen.getByText('3. How I Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('4. Cookies and Tracking')).toBeInTheDocument();
    expect(screen.getByText('5. Third-Party Services')).toBeInTheDocument();
  });

  test('has a back to home link', () => {
    render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );

    const backLink = screen.getByText(/Back to Home/);
    expect(backLink.getAttribute('href')).toBe('/');
  });
});
