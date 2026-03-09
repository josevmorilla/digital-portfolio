import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminContactInfo from '../pages/admin/AdminContactInfo';

vi.mock('../services/api', () => ({
  contactInfoAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { contactInfoAPI } from '../services/api';

const mockContacts = [
  { id: '1', type: 'email', label: 'Email', value: 'test@test.com', icon: '', visible: true, order: 1 },
  { id: '2', type: 'github', label: 'GitHub', value: 'github.com/user', icon: '', visible: false, order: 2 },
];

function renderComp() {
  return render(<MemoryRouter><AdminContactInfo /></MemoryRouter>);
}

describe('AdminContactInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contactInfoAPI.getAll.mockResolvedValue({ data: mockContacts });
  });

  test('shows loading', () => {
    contactInfoAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Email')).toBeInTheDocument());
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Hidden')).toBeInTheDocument();
  });

  test('creates contact info', async () => {
    contactInfoAPI.create.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Contact Info')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Contact Info'));

    fireEvent.change(screen.getByLabelText('Label *'), { target: { value: 'Phone' } });
    fireEvent.change(screen.getByLabelText('Value *'), { target: { value: '555-1234' } });
    fireEvent.click(screen.getByText('Create Contact Info'));
    await waitFor(() => expect(contactInfoAPI.create).toHaveBeenCalled());
  });

  test('edits contact info', async () => {
    contactInfoAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getAllByText('Edit').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Edit')[0]);
    expect(screen.getByText('Edit Contact Info')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Contact Info'));
    await waitFor(() => expect(contactInfoAPI.update).toHaveBeenCalled());
  });

  test('deletes contact info', async () => {
    contactInfoAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getAllByText('Delete').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(contactInfoAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles error', async () => {
    contactInfoAPI.create.mockRejectedValue({ response: { data: { error: 'fail' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Contact Info')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Contact Info'));
    fireEvent.change(screen.getByLabelText('Label *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Value *'), { target: { value: 'X' } });
    fireEvent.click(screen.getByText('Create Contact Info'));
    await waitFor(() => expect(screen.getByText(/Error saving contact info/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Contact Info')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Contact Info'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Contact Info')).not.toBeInTheDocument();
  });
});
