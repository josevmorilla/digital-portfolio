import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminLogin from '../pages/admin/AdminLogin';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <AdminLogin />
    </MemoryRouter>
  );
}

describe('AdminLogin', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Dashboard Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  test('updates inputs on change', () => {
    renderLogin();
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });

    expect(emailInput.value).toBe('admin@test.com');
    expect(passwordInput.value).toBe('secret');
  });

  test('navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
    expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'pass');
  });

  test('shows error on failed login', async () => {
    mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(screen.getByText('Invalid credentials')).toBeInTheDocument());
  });

  test('shows loading state during login', async () => {
    let resolveLogin;
    mockLogin.mockImplementation(() => new Promise(resolve => { resolveLogin = resolve; }));
    renderLogin();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled();

    resolveLogin({ success: true });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Login' })).not.toBeDisabled());
  });
});
