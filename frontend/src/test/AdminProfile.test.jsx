import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminProfile from '../pages/admin/AdminProfile';

vi.mock('../services/api', () => ({
  profileAPI: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

import { profileAPI } from '../services/api';

function renderProfile() {
  return render(
    <MemoryRouter>
      <AdminProfile />
    </MemoryRouter>
  );
}

describe('AdminProfile', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('shows loading spinner initially', () => {
    profileAPI.get.mockReturnValue(new Promise(() => {}));
    const { container } = renderProfile();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders profile form after loading', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: 'John', nameFr: 'Jean', titleEn: 'Dev', titleFr: 'Dév', bioEn: 'Bio', bioFr: 'Bio FR' } });
    renderProfile();
    await waitFor(() => expect(screen.getByText('Manage Profile')).toBeInTheDocument());
    expect(screen.getByLabelText('Name (English) *')).toHaveValue('John');
    expect(screen.getByLabelText('Name (French) *')).toHaveValue('Jean');
  });

  test('handles form submission success', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: 'John', nameFr: 'Jean', titleEn: 'Dev', titleFr: 'Dév', bioEn: '', bioFr: '' } });
    profileAPI.update.mockResolvedValue({ data: {} });
    renderProfile();
    await waitFor(() => expect(screen.getByText('Save Profile')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument());
  });

  test('handles form submission error', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: 'John', nameFr: 'Jean', titleEn: 'Dev', titleFr: 'Dév', bioEn: '', bioFr: '' } });
    profileAPI.update.mockRejectedValue({ response: { data: { error: 'Server error' } } });
    renderProfile();
    await waitFor(() => expect(screen.getByText('Save Profile')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => expect(screen.getByText(/Error saving profile/)).toBeInTheDocument());
  });

  test('handles fetch error gracefully', async () => {
    profileAPI.get.mockRejectedValue(new Error('Network error'));
    renderProfile();
    await waitFor(() => expect(screen.getByText('Manage Profile')).toBeInTheDocument());
  });

  test('has back to dashboard link', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: '', nameFr: '', titleEn: '', titleFr: '', bioEn: '', bioFr: '' } });
    renderProfile();
    await waitFor(() => expect(screen.getByText('Back to Dashboard')).toBeInTheDocument());
    expect(screen.getByText('Back to Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
