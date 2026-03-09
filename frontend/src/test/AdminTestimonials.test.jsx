import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminTestimonials from '../pages/admin/AdminTestimonials';

vi.mock('../services/api', () => ({
  testimonialsAPI: {
    getAll: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { testimonialsAPI } from '../services/api';

const mockTestimonials = [
  { id: '1', name: 'Alice', company: 'Acme', position: 'CTO', content: 'Great work!', approved: false, order: 1, createdAt: '2025-01-15T10:00:00Z' },
  { id: '2', name: 'Bob', company: null, position: null, content: 'Excellent developer', approved: true, order: 2, createdAt: '2025-01-14T10:00:00Z' },
];

function renderComp() {
  return render(<MemoryRouter><AdminTestimonials /></MemoryRouter>);
}

describe('AdminTestimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testimonialsAPI.getAll.mockResolvedValue({ data: mockTestimonials });
  });

  test('shows loading', () => {
    testimonialsAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders testimonials list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText(/All Testimonials/)).toBeInTheDocument());
    expect(screen.getByText('Great work!')).toBeInTheDocument();
    expect(screen.getByText('Excellent developer')).toBeInTheDocument();
  });

  test('shows pending and approved sections', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText(/Pending Review/)).toBeInTheDocument());
    expect(screen.getAllByText(/Approved/).length).toBeGreaterThan(0);
  });

  test('approves a testimonial', async () => {
    testimonialsAPI.approve.mockResolvedValue({});
    renderComp();
    await waitFor(() => expect(screen.getByText('✓ Approve')).toBeInTheDocument());
    fireEvent.click(screen.getByText('✓ Approve'));
    await waitFor(() => expect(testimonialsAPI.approve).toHaveBeenCalledWith('1'));
  });

  test('rejects a testimonial', async () => {
    testimonialsAPI.reject.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('✗ Reject')).toBeInTheDocument());
    fireEvent.click(screen.getByText('✗ Reject'));
    await waitFor(() => expect(testimonialsAPI.reject).toHaveBeenCalledWith('1'));
  });

  test('unapproves a testimonial', async () => {
    testimonialsAPI.update.mockResolvedValue({});
    renderComp();
    await waitFor(() => expect(screen.getByText('Unapprove')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Unapprove'));
    await waitFor(() => expect(testimonialsAPI.update).toHaveBeenCalledWith('2', expect.objectContaining({ approved: false })));
  });

  test('deletes an approved testimonial', async () => {
    testimonialsAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getAllByText('Delete').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(testimonialsAPI.delete).toHaveBeenCalledWith('2'));
  });

  test('filters by status', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText(/All Testimonials/)).toBeInTheDocument());

    // Click the pending filter button
    const pendingBtn = document.querySelector('.status-filter-pending');
    fireEvent.click(pendingBtn);
    expect(screen.getByText('Great work!')).toBeInTheDocument();
  });

  test('shows empty state', async () => {
    testimonialsAPI.getAll.mockResolvedValue({ data: [] });
    renderComp();
    await waitFor(() => expect(screen.getByText(/No testimonials yet/)).toBeInTheDocument());
  });

  test('handles approve error', async () => {
    testimonialsAPI.approve.mockRejectedValue({ response: { data: { error: 'fail' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('✓ Approve')).toBeInTheDocument());
    fireEvent.click(screen.getByText('✓ Approve'));
    await waitFor(() => expect(screen.getByText(/Error approving/)).toBeInTheDocument());
  });

  test('has back link', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Back to Dashboard')).toBeInTheDocument());
  });
});
