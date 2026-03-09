import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';

// Helper to expose context values
function TestConsumer() {
  const { language, toggleLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('defaults to "en"', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  test('reads initial language from localStorage', () => {
    localStorage.setItem('language', 'fr');
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('fr');
  });

  test('toggleLanguage switches en to fr', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('fr');
  });

  test('toggleLanguage switches fr back to en', async () => {
    localStorage.setItem('language', 'fr');
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('lang').textContent).toBe('en');
  });

  test('persists language to localStorage', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    );

    await user.click(screen.getByText('Toggle'));
    expect(localStorage.getItem('language')).toBe('fr');
  });

  test('throws error when useLanguage is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useLanguage must be used within a LanguageProvider');
    spy.mockRestore();
  });
});
