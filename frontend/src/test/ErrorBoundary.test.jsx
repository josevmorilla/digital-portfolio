import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import ErrorBoundary from '../components/ErrorBoundary';

function ThrowingComponent() {
  throw new Error('Test error');
}

function GoodComponent() {
  return <div>All good</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.warn from ErrorBoundary.componentDidCatch
  vi.spyOn(console, 'warn').mockImplementation(() => {});

  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <GoodComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  test('renders error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });

  test('renders nothing when fallback is silent', () => {
    const { container } = render(
      <ErrorBoundary fallback="silent">
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(container.innerHTML).toBe('');
  });

  test('Go Home button navigates to /', () => {
    const originalLocation = globalThis.location;
    delete globalThis.location;
    globalThis.location = { href: '', reload: vi.fn() };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Go Home'));
    expect(globalThis.location.href).toBe('/');

    globalThis.location = originalLocation;
  });

  test('Refresh Page button reloads the page', () => {
    const originalLocation = globalThis.location;
    delete globalThis.location;
    globalThis.location = { href: '', reload: vi.fn() };

    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Refresh Page'));
    expect(globalThis.location.reload).toHaveBeenCalled();

    globalThis.location = originalLocation;
  });
});
