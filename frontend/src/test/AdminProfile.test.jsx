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

  test('updates all form fields via onChange', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: 'A', nameFr: 'B', titleEn: 'C', titleFr: 'D', bioEn: 'E', bioFr: 'F' } });
    renderProfile();
    await waitFor(() => expect(screen.getByLabelText('Name (English) *')).toHaveValue('A'));

    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'NewA' } });
    expect(screen.getByLabelText('Name (English) *')).toHaveValue('NewA');

    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'NewB' } });
    expect(screen.getByLabelText('Name (French) *')).toHaveValue('NewB');

    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'NewC' } });
    expect(screen.getByLabelText('Title (English) *')).toHaveValue('NewC');

    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'NewD' } });
    expect(screen.getByLabelText('Title (French) *')).toHaveValue('NewD');

    fireEvent.change(screen.getByLabelText('Bio (English)'), { target: { value: 'NewE' } });
    expect(screen.getByLabelText('Bio (English)')).toHaveValue('NewE');

    fireEvent.change(screen.getByLabelText('Bio (French)'), { target: { value: 'NewF' } });
    expect(screen.getByLabelText('Bio (French)')).toHaveValue('NewF');
  });
});
