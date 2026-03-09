import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminProjects from '../pages/admin/AdminProjects';

vi.mock('../services/api', () => ({
  projectsAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    uploadImage: vi.fn(),
  },
  getUploadUrl: vi.fn((url) => url || ''),
}));

import { projectsAPI } from '../services/api';

const mockProjects = [
  {
    id: '1', titleEn: 'My Project', titleFr: 'Mon Projet',
    descriptionEn: 'Desc EN', descriptionFr: 'Desc FR',
    technologies: ['React', 'Node'], featured: true, order: 1,
    startDate: '2024-01-01', endDate: '2024-06-01',
    imageUrl: '', projectUrl: '', githubUrl: '',
  },
];

function renderProjects() {
  return render(
    <MemoryRouter>
      <AdminProjects />
    </MemoryRouter>
  );
}

describe('AdminProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    projectsAPI.getAll.mockResolvedValue({ data: mockProjects });
  });

  test('shows loading initially', () => {
    projectsAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderProjects();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders project list', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('My Project / Mon Projet')).toBeInTheDocument());
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText(/React, Node/)).toBeInTheDocument();
  });

  test('shows add form', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    expect(screen.getByText('Add New Project')).toBeInTheDocument();
  });

  test('creates a project', async () => {
    projectsAPI.create.mockResolvedValue({ data: {} });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));

    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'New' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'Nouveau' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'Desc' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'Desc FR' } });
    fireEvent.change(screen.getByLabelText(/Technologies/), { target: { value: 'React, Vue' } });
    fireEvent.click(screen.getByText('Create Project'));

    await waitFor(() => expect(projectsAPI.create).toHaveBeenCalled());
  });

  test('edits a project', async () => {
    projectsAPI.update.mockResolvedValue({ data: {} });
    globalThis.scrollTo = vi.fn();
    renderProjects();
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Edit Project')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Project'));
    await waitFor(() => expect(projectsAPI.update).toHaveBeenCalled());
  });

  test('deletes a project', async () => {
    projectsAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderProjects();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(projectsAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('handles create error', async () => {
    projectsAPI.create.mockRejectedValue({ response: { data: { error: 'Validation failed' } } });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText(/Technologies/), { target: { value: 'JS' } });
    fireEvent.click(screen.getByText('Create Project'));
    await waitFor(() => expect(screen.getByText(/Error saving project/)).toBeInTheDocument());
  });

  test('cancels form', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Project')).not.toBeInTheDocument();
  });

  test('handles image upload', async () => {
    projectsAPI.uploadImage.mockResolvedValue({ data: { imageUrl: '/uploads/img.png' } });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));

    const fileInput = screen.getByLabelText('Project Screenshot/Image');
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => expect(projectsAPI.uploadImage).toHaveBeenCalled());
  });

  test('rejects invalid file type', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));

    const fileInput = screen.getByLabelText('Project Screenshot/Image');
    const file = new File(['test'], 'doc.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByText(/Invalid file type/)).toBeInTheDocument();
    expect(projectsAPI.uploadImage).not.toHaveBeenCalled();
  });

  test('rejects oversized file', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));

    const fileInput = screen.getByLabelText('Project Screenshot/Image');
    const bigFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'big.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [bigFile] } });

    expect(screen.getByText(/File size too large/)).toBeInTheDocument();
  });

  test('handles delete error', async () => {
    projectsAPI.delete.mockRejectedValue({ response: { data: { error: 'Cannot delete' } } });
    globalThis.confirm = vi.fn(() => true);
    renderProjects();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(screen.getByText(/Error deleting project/)).toBeInTheDocument());
  });

  test('does not delete when confirm returns false', async () => {
    globalThis.confirm = vi.fn(() => false);
    renderProjects();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    expect(projectsAPI.delete).not.toHaveBeenCalled();
  });

  test('handles image upload error', async () => {
    projectsAPI.uploadImage.mockRejectedValue(new Error('Upload failed'));
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    const fileInput = screen.getByLabelText('Project Screenshot/Image');
    const file = new File(['test'], 'img.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Error uploading image: Upload failed/)).toBeInTheDocument());
  });

  test('successful image upload sets URL and shows remove button', async () => {
    projectsAPI.uploadImage.mockResolvedValue({ data: { imageUrl: '/uploads/test.jpg' } });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    const fileInput = screen.getByLabelText('Project Screenshot/Image');
    const file = new File(['test'], 'img.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText(/Image uploaded/)).toBeInTheDocument());
    // Remove image button should be available
    const removeBtn = screen.getByText('Remove Image');
    fireEvent.click(removeBtn);
  });

  test('handles create error with message fallback', async () => {
    projectsAPI.create.mockRejectedValue(new Error('Network error'));
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Technologies (comma-separated) *'), { target: { value: 'React' } });
    fireEvent.click(screen.getByText('Create Project'));
    await waitFor(() => expect(screen.getByText(/Error saving project: Network error/)).toBeInTheDocument());
  });

  test('handles delete error with message fallback', async () => {
    projectsAPI.delete.mockRejectedValue(new Error('Network error'));
    globalThis.confirm = vi.fn(() => true);
    renderProjects();
    await waitFor(() => expect(screen.getByText('Delete')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Delete'));
    await waitFor(() => expect(screen.getByText(/Error deleting project: Network error/)).toBeInTheDocument());
  });

  test('normalizes URLs without protocol', async () => {
    projectsAPI.create.mockResolvedValue({ data: {} });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Technologies (comma-separated) *'), { target: { value: 'React' } });
    fireEvent.change(screen.getByLabelText('Deployed Project URL'), { target: { value: 'example.com' } });
    fireEvent.change(screen.getByLabelText('GitHub URL'), { target: { value: 'github.com/test' } });
    fireEvent.click(screen.getByText('Create Project'));
    await waitFor(() => expect(projectsAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/test',
      })
    ));
  });

  test('handles fetch error', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    projectsAPI.getAll.mockRejectedValue(new Error('fail'));
    renderProjects();
    await waitFor(() => expect(screen.getByText('Manage Projects')).toBeInTheDocument());
  });

  test('creates project with dates and featured', async () => {
    projectsAPI.create.mockResolvedValue({ data: {} });
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.change(screen.getByLabelText('Title (English) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Title (French) *'), { target: { value: 'P' } });
    fireEvent.change(screen.getByLabelText('Description (English) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Description (French) *'), { target: { value: 'D' } });
    fireEvent.change(screen.getByLabelText('Technologies (comma-separated) *'), { target: { value: 'React' } });
    fireEvent.change(screen.getByLabelText('Start Date'), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/End Date/), { target: { value: '2024-12-31' } });
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByText('Create Project'));
    await waitFor(() => expect(projectsAPI.create).toHaveBeenCalled());
  });

  test('updates order and imageUrl fields', async () => {
    renderProjects();
    await waitFor(() => expect(screen.getByText('+ Add New Project')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Project'));
    fireEvent.change(screen.getByLabelText('Order'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Image URL (Alternative)'), { target: { value: 'https://example.com/img.png' } });
  });
});
