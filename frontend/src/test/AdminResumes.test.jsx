import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminResumes from '../pages/admin/AdminResumes';

vi.mock('../services/api', () => ({
  resumesAPI: {
    getAll: vi.fn(),
    upload: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    download: vi.fn((id) => `/api/resumes/${id}/download`),
  },
}));

import { resumesAPI } from '../services/api';

const mockResumes = [
  { id: '1', titleEn: 'Resume EN', titleFr: 'CV FR', descriptionEn: '', descriptionFr: '', fileUrl: '/uploads/resume.pdf', language: 'en', order: 1, createdAt: '2025-01-15T10:00:00Z' },
];

function renderComp() {
  return render(<MemoryRouter><AdminResumes /></MemoryRouter>);
}

describe('AdminResumes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resumesAPI.getAll.mockResolvedValue({ data: mockResumes });
  });

  test('shows loading', () => {
    resumesAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders resume list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Resume EN')).toBeInTheDocument());
  });

  test('shows upload form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));
    expect(screen.getByText('Add New Resume')).toBeInTheDocument();
  });

  test('uploads a resume', async () => {
    resumesAPI.upload.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));

    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'My Resume' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'Mon CV' } });

    const fileInput = screen.getByLabelText(/Upload Resume PDF/);
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => expect(screen.getByText(/Selected: resume.pdf/)).toBeInTheDocument());
    fireEvent.submit(screen.getByText('Upload Resume').closest('form'));
    await waitFor(() => expect(resumesAPI.upload).toHaveBeenCalled());
  });

  test('rejects non-PDF file', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));

    const fileInput = screen.getByLabelText(/Upload Resume PDF/);
    const file = new File(['test'], 'doc.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText(/Please select a PDF file/)).toBeInTheDocument();
  });

  test('edits a resume', async () => {
    resumesAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Resume')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Resume'));
    await waitFor(() => expect(resumesAPI.update).toHaveBeenCalled());
  });

  test('deletes a resume', async () => {
    resumesAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(resumesAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles error', async () => {
    resumesAPI.upload.mockRejectedValue({ response: { data: { error: 'fail' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));

    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'X' } });
    const fileInput = screen.getByLabelText(/Upload Resume PDF/);
    const file = new File(['test'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Selected: resume.pdf/)).toBeInTheDocument());
    fireEvent.submit(screen.getByText('Upload Resume').closest('form'));
    await waitFor(() => expect(screen.getByText(/Error saving resume/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Resume')).not.toBeInTheDocument();
  });

  test('requires file for new resume', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Upload New Resume')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Upload New Resume'));
    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'X' } });
    fireEvent.submit(screen.getByText('Upload Resume').closest('form'));
    await waitFor(() => expect(screen.getByText(/Please select a PDF file/)).toBeInTheDocument());
  });
});
