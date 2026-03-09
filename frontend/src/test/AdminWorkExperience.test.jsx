import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminWorkExperience from '../pages/admin/AdminWorkExperience';

vi.mock('../services/api', () => ({
  workExperienceAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import { workExperienceAPI } from '../services/api';

const mockExps = [
  {
    id: '1', companyEn: 'Acme', companyFr: 'Acme FR', positionEn: 'Dev', positionFr: 'Dév',
    descriptionEn: 'Built stuff', descriptionFr: 'Construit trucs', location: 'Montreal',
    startDate: '2023-01-01', endDate: null, current: true, order: 1,
  },
];

function renderComp() {
  return render(<MemoryRouter><AdminWorkExperience /></MemoryRouter>);
}

describe('AdminWorkExperience', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    workExperienceAPI.getAll.mockResolvedValue({ data: mockExps });
  });

  test('shows loading', () => {
    workExperienceAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Dev')).toBeInTheDocument());
    expect(screen.getByText('Current')).toBeInTheDocument();
  });

  test('creates new experience', async () => {
    workExperienceAPI.create.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Experience')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Experience'));

    fireEvent.change(screen.getByLabelText('Company (English) *'), { target: { value: 'Co' } });
    fireEvent.change(screen.getByLabelText('Company (French) *'), { target: { value: 'Co FR' } });
    fireEvent.change(screen.getByLabelText('Position (English) *'), { target: { value: 'Eng' } });
    fireEvent.change(screen.getByLabelText('Position (French) *'), { target: { value: 'Ing' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Start Date *'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByText('Create Experience'));

    await waitFor(() => expect(workExperienceAPI.create).toHaveBeenCalled());
  });

  test('edits experience', async () => {
    workExperienceAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Experience')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Experience'));
    await waitFor(() => expect(workExperienceAPI.update).toHaveBeenCalled());
  });

  test('deletes experience', async () => {
    workExperienceAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(workExperienceAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles submit error', async () => {
    workExperienceAPI.create.mockRejectedValue({ response: { data: { error: 'Bad' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Experience')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Experience'));
    fireEvent.change(screen.getByLabelText('Company (English) *'), { target: { value: 'C' } });
    fireEvent.change(screen.getByLabelText('Company (French) *'), { target: { value: 'C' } });
    fireEvent.change(screen.getByLabelText('Position (English) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Position (French) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Start Date *'), { target: { value: '2024-01-01' } });
    fireEvent.click(screen.getByText('Create Experience'));
    await waitFor(() => expect(screen.getByText(/Error saving experience/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Experience')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Experience'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Experience')).not.toBeInTheDocument();
  });
});
