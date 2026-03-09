import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminSkills from '../pages/admin/AdminSkills';

vi.mock('../services/api', () => ({
  skillsAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  categorySettingsAPI: {
    getAll: vi.fn(),
    updateAll: vi.fn(),
  },
}));

import { skillsAPI, categorySettingsAPI } from '../services/api';

const mockSkills = [
  { id: '1', nameEn: 'React', nameFr: 'React', category: 'Frameworks', icon: 'react', order: 1 },
  { id: '2', nameEn: 'Node.js', nameFr: 'Node.js', category: 'Tools', icon: 'nodejs', order: 1 },
];

function renderSkills() {
  return render(
    <MemoryRouter>
      <AdminSkills />
    </MemoryRouter>
  );
}

describe('AdminSkills', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    skillsAPI.getAll.mockResolvedValue({ data: mockSkills });
    categorySettingsAPI.getAll.mockResolvedValue({ data: [{ category: 'Frameworks', displayOrder: 1, speed: 3000 }] });
  });

  test('shows loading spinner initially', () => {
    skillsAPI.getAll.mockReturnValue(new Promise(() => {}));
    const { container } = renderSkills();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  test('renders skills list after loading', async () => {
    renderSkills();
    await waitFor(() => expect(screen.getByText(/All Skills/)).toBeInTheDocument());
    expect(screen.getByText('React / React')).toBeInTheDocument();
    expect(screen.getByText('Node.js / Node.js')).toBeInTheDocument();
  });

  test('shows add form when button clicked', async () => {
    renderSkills();
    await waitFor(() => expect(screen.getByText('+ Add New Skill')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Skill'));
    expect(screen.getByText('Add New Skill')).toBeInTheDocument();
  });

  test('creates a new skill', async () => {
    skillsAPI.create.mockResolvedValue({ data: {} });
    renderSkills();
    await waitFor(() => expect(screen.getByText('+ Add New Skill')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Skill'));

    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'Python' } });
    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'Python' } });
    fireEvent.change(screen.getByLabelText('Category *'), { target: { value: 'Languages' } });
    fireEvent.click(screen.getByText('Create Skill'));

    await waitFor(() => expect(skillsAPI.create).toHaveBeenCalled());
  });

  test('edits an existing skill', async () => {
    skillsAPI.update.mockResolvedValue({ data: {} });
    // Mock scrollTo
    globalThis.scrollTo = vi.fn();
    renderSkills();
    await waitFor(() => expect(screen.getAllByText('Edit').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Edit')[0]);

    expect(screen.getByText('Edit Skill')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Update Skill'));

    await waitFor(() => expect(skillsAPI.update).toHaveBeenCalled());
  });

  test('deletes a skill', async () => {
    skillsAPI.delete.mockResolvedValue({});
    globalThis.confirm = vi.fn(() => true);
    renderSkills();
    await waitFor(() => expect(screen.getAllByText('Delete').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Delete')[0]);

    expect(globalThis.confirm).toHaveBeenCalled();
    await waitFor(() => expect(skillsAPI.delete).toHaveBeenCalledWith('1'));
  });

  test('cancels delete when not confirmed', async () => {
    globalThis.confirm = vi.fn(() => false);
    renderSkills();
    await waitFor(() => expect(screen.getAllByText('Delete').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(skillsAPI.delete).not.toHaveBeenCalled();
  });

  test('cancels form with cancel button', async () => {
    renderSkills();
    await waitFor(() => expect(screen.getByText('+ Add New Skill')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Skill'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Add New Skill')).not.toBeInTheDocument();
  });

  test('handles category settings', async () => {
    renderSkills();
    await waitFor(() => expect(screen.getByText('Category Carousel Settings')).toBeInTheDocument());
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
  });

  test('saves category settings', async () => {
    categorySettingsAPI.updateAll.mockResolvedValue({ data: [{ category: 'Frameworks', displayOrder: 1, speed: 3000 }] });
    renderSkills();
    await waitFor(() => expect(screen.getByText('Save Category Settings')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Save Category Settings'));
    await waitFor(() => expect(categorySettingsAPI.updateAll).toHaveBeenCalled());
  });

  test('handles create error', async () => {
    skillsAPI.create.mockRejectedValue({ response: { data: { error: 'Duplicate skill' } } });
    renderSkills();
    await waitFor(() => expect(screen.getByText('+ Add New Skill')).toBeInTheDocument());
    fireEvent.click(screen.getByText('+ Add New Skill'));
    fireEvent.change(screen.getByLabelText('Name (English) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Name (French) *'), { target: { value: 'X' } });
    fireEvent.change(screen.getByLabelText('Category *'), { target: { value: 'Languages' } });
    fireEvent.click(screen.getByText('Create Skill'));

    await waitFor(() => expect(screen.getByText(/Error saving skill/)).toBeInTheDocument());
  });

  test('handles delete error', async () => {
    skillsAPI.delete.mockRejectedValue({ response: { data: { error: 'Cannot delete' } } });
    globalThis.confirm = vi.fn(() => true);
    renderSkills();
    await waitFor(() => expect(screen.getAllByText('Delete').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect(screen.getByText(/Error deleting skill/)).toBeInTheDocument());
  });

  test('handles category settings save error', async () => {
    categorySettingsAPI.updateAll.mockRejectedValue({ response: { data: { error: 'Save failed' } } });
    renderSkills();
    await waitFor(() => expect(screen.getByText('Save Category Settings')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Save Category Settings'));
    await waitFor(() => expect(screen.getByText(/Error saving/)).toBeInTheDocument());
  });

  test('shows empty state when no skills', async () => {
    skillsAPI.getAll.mockResolvedValue({ data: [] });
    categorySettingsAPI.getAll.mockResolvedValue({ data: [] });
    renderSkills();
    await waitFor(() => expect(screen.getByText('No skills yet. Add your first skill!')).toBeInTheDocument());
  });

  test('has back to dashboard link', async () => {
    renderSkills();
    await waitFor(() => expect(screen.getByText('Back to Dashboard')).toBeInTheDocument());
    expect(screen.getByText('Back to Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
