import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminEducation from '../pages/admin/AdminEducation';

vi.mock('../services/api', () => ({
  educationAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { educationAPI } from '../services/api';

const mockEdus = [
  {
    id: '1', institutionEn: 'MIT', institutionFr: 'MIT', degreeEn: 'BSc', degreeFr: 'BSc',
    fieldEn: 'CS', fieldFr: 'Info', descriptionEn: '', descriptionFr: '', location: 'Boston',
    startDate: '2020-09-01', endDate: '2024-05-01', current: false, gpa: '3.9', order: 1,
  },
];

function renderComp() {
  return render(<MemoryRouter><AdminEducation /></MemoryRouter>);
}

describe('AdminEducation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    educationAPI.getAll.mockResolvedValue({ data: mockEdus });
  });

  test('shows loading', () => {
    educationAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('BSc in CS')).toBeInTheDocument());
    expect(screen.getByText('GPA: 3.9')).toBeInTheDocument();
  });

  test('creates education', async () => {
    educationAPI.create.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Education')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Education'));

    fireEvent.change(screen.getByLabelText('Institution (English) *'), { target: { value: 'UBC' } });
    fireEvent.change(screen.getByLabelText('Institution (French) *'), { target: { value: 'UBC FR' } });
    fireEvent.change(screen.getByLabelText('Degree (English) *'), { target: { value: 'MSc' } });
    fireEvent.change(screen.getByLabelText('Degree (French) *'), { target: { value: 'MSc' } });
    fireEvent.change(screen.getByLabelText('Field (English) *'), { target: { value: 'AI' } });
    fireEvent.change(screen.getByLabelText('Field (French) *'), { target: { value: 'IA' } });
    fireEvent.change(screen.getByLabelText('Start Date *'), { target: { value: '2024-09-01' } });
    fireEvent.click(screen.getByText('Create Education'));

    await waitFor(() => expect(educationAPI.create).toHaveBeenCalled());
  });

  test('edits education', async () => {
    educationAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Education')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Education'));
    await waitFor(() => expect(educationAPI.update).toHaveBeenCalled());
  });

  test('deletes education', async () => {
    educationAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(educationAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles error', async () => {
    educationAPI.create.mockRejectedValue({ response: { data: { error: 'fail' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Education')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Education'));
    fireEvent.change(screen.getByLabelText('Institution (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Institution (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Degree (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Degree (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Field (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Field (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Start Date *'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByText('Create Education'));
    await waitFor(() => expect(screen.getByText(/Error saving education/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Education')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Education'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Education')).not.toBeInTheDocument();
  });

  test('does not delete when confirm returns false', async () => {
    globalThis.confirm = vi.fn(() => false);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    expect(educationAPI.delete).not.toHaveBeenCalled();
  });

  test('handles delete error with message fallback', async () => {
    educationAPI.delete.mockRejectedValue(new Error('Network fail'));
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(screen.getByText(/Error deleting education: Network fail/)).toBeInTheDocument());
  });

  test('handles create error with message fallback', async () => {
    educationAPI.create.mockRejectedValue(new Error('Network fail'));
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Education')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Education'));
    fireEvent.change(screen.getByLabelText('Institution (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Institution (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Degree (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Degree (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Field (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Field (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Start Date *'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByText('Create Education'));
    await waitFor(() => expect(screen.getByText(/Error saving education: Network fail/)).toBeInTheDocument());
  });

  test('handles fetch error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    educationAPI.getAll.mockRejectedValue(new Error('fail'));
    renderComp();
    await waitFor(() => expect(screen.getByText('Manage Education')).toBeInTheDocument());
  });

  test('renders current education badge', async () => {
    educationAPI.getAll.mockResolvedValue({ data: [{
      ...mockEdus[0], current: true, endDate: null,
    }] });
    renderComp();
    await waitFor(() => expect(screen.getByText('Current')).toBeInTheDocument());
  });

  test('updates description and date fields', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Education')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Education'));
    fireEvent.change(screen.getByLabelText('Description (English)'), { target: { value: 'desc' } });
    fireEvent.change(screen.getByLabelText('Description (French)'), { target: { value: 'desc FR' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'City' } });
    fireEvent.change(screen.getByLabelText('GPA'), { target: { value: '3.9' } });
    fireEvent.change(screen.getByLabelText('End Date'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Order'), { target: { value: '5' } });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
  });

  test('populates form when editing existing education', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByLabelText('Institution (English) *')).toHaveValue('MIT');
    expect(screen.getByLabelText('Degree (English) *')).toHaveValue('BSc');
    expect(screen.getByLabelText('GPA')).toHaveValue('3.9');
  });
});
