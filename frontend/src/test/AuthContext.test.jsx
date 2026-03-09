import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { AuthProvider, useAuth } from '../context/AuthContext';

vi.mock('axios');

function TestConsumer() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <button onClick={() => login('test@test.com', 'pass')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test('starts unauthenticated when no token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('no');
    });
  });

  test('fetches user when token exists in localStorage', async () => {
    localStorage.setItem('token', 'existing-token');
    axios.get.mockResolvedValue({ data: { user: { id: '1', name: 'Jose', email: 'jose@test.com' } } });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('yes');
      expect(screen.getByTestId('user').textContent).toBe('Jose');
    });
  });

  test('login sets token and user on success', async () => {
    axios.post.mockResolvedValue({
      data: { token: 'new-token', user: { id: '1', name: 'Jose', email: 'jose@test.com' } },
    });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('no'));
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('yes');
      expect(localStorage.getItem('token')).toBe('new-token');
    });
  });

  test('login returns error on failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('no'));
    // The login function is called internally — we just verify the state stays unauthenticated
    await user.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('no');
    });
  });

  test('logout clears token and user', async () => {
    localStorage.setItem('token', 'existing-token');
    axios.get.mockResolvedValue({ data: { user: { id: '1', name: 'Jose', email: 'jose@test.com' } } });

    const user = userEvent.setup();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('yes'));
    await user.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('no');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  test('throws error when useAuth is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within an AuthProvider');
    spy.mockRestore();
  });
});
