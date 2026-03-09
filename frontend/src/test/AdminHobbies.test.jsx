import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminHobbies from '../pages/admin/AdminHobbies';

vi.mock('../services/api', () => ({
  hobbiesAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadImage: vi.fn(),
  },
  getUploadUrl: vi.fn((url) => url || ''),
}));

import { hobbiesAPI } from '../services/api';

const mockHobbies = [
  {
    id: '1', nameEn: 'Gaming', nameFr: 'Jeux', descriptionEn: 'Fun', descriptionFr: 'Amusant',
    icon: 'gamepad', imageUrl: '', technologies: ['Unity'], links: [],
    startDate: null, endDate: null, featured: true, order: 1,
  },
];

function renderComp() {
  return render(<MemoryRouter><AdminHobbies /></MemoryRouter>);
}

describe('AdminHobbies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hobbiesAPI.getAll.mockResolvedValue({ data: mockHobbies });
  });

  test('shows loading', () => {
    hobbiesAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderComp();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders list', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('Gaming / Jeux')).toBeInTheDocument());
    expect(screen.getByText('Fun')).toBeInTheDocument();
  });

  test('creates hobby', async () => {
    hobbiesAPI.create.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'Music' } });
    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'Musique' } });
    fireEvent.click(screen.getByText('Create Hobby'));
    await waitFor(() => expect(hobbiesAPI.create).toHaveBeenCalled());
  });

  test('edits hobby', async () => {
    hobbiesAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByText('Edit Hobby')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Hobby'));
    await waitFor(() => expect(hobbiesAPI.update).toHaveBeenCalled());
  });

  test('deletes hobby', async () => {
    hobbiesAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(hobbiesAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles error', async () => {
    hobbiesAPI.create.mockRejectedValue({ response: { data: { error: 'fail' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'X' } });
    fireEvent.click(screen.getByText('Create Hobby'));
    await waitFor(() => expect(screen.getByText(/Error saving hobby/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Hobby')).not.toBeInTheDocument();
  });

  test('uploads image successfully', async () => {
    hobbiesAPI.uploadImage.mockResolvedValue({ data: { imageUrl: '/img/test.jpg' } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    const fileInput = screen.getByLabelText('Hobby Image');
    const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(hobbiesAPI.uploadImage).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText('Image uploaded successfully!')).toBeInTheDocument());
  });

  test('rejects invalid image type', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    const fileInput = screen.getByLabelText('Hobby Image');
    const file = new File(['data'], 'doc.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(screen.getByText(/Invalid file type/)).toBeInTheDocument();
  });

  test('rejects oversized image', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    const fileInput = screen.getByLabelText('Hobby Image');
    const bigFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    expect(screen.getByText(/File size too large/)).toBeInTheDocument();
  });

  test('handles image upload error', async () => {
    hobbiesAPI.uploadImage.mockRejectedValue({ response: { data: { error: 'Upload failed' } } });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    const fileInput = screen.getByLabelText('Hobby Image');
    const file = new File(['img'], 'photo.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Error uploading image/)).toBeInTheDocument());
  });

  test('manages links (add and remove)', async () => {
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    // Add a link
    fireEvent.click(screen.getByText('+ Add Link'));
    // Now should have 2 link rows with Remove buttons
    expect(screen.getAllByPlaceholderText(/Link label/).length).toBe(2);
    // Remove one link
    fireEvent.click(screen.getAllByText('Remove')[0]);
    expect(screen.getAllByPlaceholderText(/Link label/).length).toBe(1);
  });

  test('fills in technologies and dates', async () => {
    hobbiesAPI.create.mockResolvedValue({ data: {} });
    renderComp();
    await waitFor(() => expect(screen.getByText('+ Add New Hobby')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Hobby'));
    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'Coding' } });
    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'Programmation' } });
    fireEvent.change(screen.getByLabelText(/Technologies/), { target: { value: 'JS, Python' } });
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2023-01-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/), { target: { value: '2024-01-01' } });
    const featuredCheckbox = screen.getByRole('checkbox');
    fireEvent.click(featuredCheckbox);
    fireEvent.click(screen.getByText('Create Hobby'));
    await waitFor(() => expect(hobbiesAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({ technologies: ['JS', 'Python'], featured: true })
    ));
  });

  test('edits hobby with links and technologies', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [{
      id: '2', nameEn: 'Hiking', nameFr: 'Randonnée', descriptionEn: 'Trails', descriptionFr: 'Sentiers',
      icon: '', imageUrl: '/img/hike.jpg', technologies: ['Outdoor', 'Camping'], 
      links: [{ label: 'Blog', url: 'https://myblog.com' }],
      startDate: '2020-01-15T00:00:00Z', endDate: null, featured: true, order: 1,
    }] });
    hobbiesAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderComp();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByDisplayValue('Hiking')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Outdoor, Camping')).toBeInTheDocument();
    // Image preview with remove button
    expect(screen.getByText('Remove Image')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Remove Image'));
    fireEvent.click(screen.getByText('Update Hobby'));
    await waitFor(() => expect(hobbiesAPI.update).toHaveBeenCalled());
  });

  test('handles delete error', async () => {
    hobbiesAPI.delete.mockRejectedValue({ response: { data: { error: 'Cannot delete' } } });
    globalThis.confirm = vi.fn(() => true);
    renderComp();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(screen.getByText(/Error deleting hobby/)).toBeInTheDocument());
  });
});
