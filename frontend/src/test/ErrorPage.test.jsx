import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from '../pages/public/ErrorPage';

describe('ErrorPage', () => {
  test('renders 404 by default', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  test('renders custom error code', () => {
    render(
      <MemoryRouter>
        <ErrorPage code={500} />
      </MemoryRouter>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });

  test('renders 401 error', () => {
    render(
      <MemoryRouter>
        <ErrorPage code={401} />
      </MemoryRouter>
    );

    expect(screen.getByText('401')).toBeInTheDocument();
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });

  test('renders 403 error', () => {
    render(
      <MemoryRouter>
        <ErrorPage code={403} />
      </MemoryRouter>
    );

    expect(screen.getByText('403')).toBeInTheDocument();
    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  test('renders custom title and message', () => {
    render(
      <MemoryRouter>
        <ErrorPage code={418} title="I'm a Teapot" message="Short and stout" />
      </MemoryRouter>
    );

    expect(screen.getByText('418')).toBeInTheDocument();
    expect(screen.getByText("I'm a Teapot")).toBeInTheDocument();
    expect(screen.getByText('Short and stout')).toBeInTheDocument();
  });

  test('Go Home link points to /', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Go Home');
    expect(homeLink.getAttribute('href')).toBe('/');
  });

  test('Go Back button calls history.back', async () => {
    const spy = vi.spyOn(globalThis.history, 'back').mockImplementation(() => {});
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    await user.click(screen.getByText('Go Back'));
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
