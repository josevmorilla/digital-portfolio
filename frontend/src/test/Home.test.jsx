import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/public/Home';

// Mock devicon CSS import
vi.mock('devicon/devicon.min.css', () => ({}));

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', toggleLanguage: vi.fn() }),
}));

vi.mock('react-icons/fi', () => ({
  FiMail: () => <span>FiMail</span>,
  FiMapPin: () => <span>FiMapPin</span>,
  FiGithub: () => <span>FiGithub</span>,
  FiLinkedin: () => <span>FiLinkedin</span>,
}));

vi.mock('../services/api', () => ({
  skillsAPI: { getAll: vi.fn() },
  projectsAPI: { getAll: vi.fn() },
  workExperienceAPI: { getAll: vi.fn() },
  educationAPI: { getAll: vi.fn() },
  contactInfoAPI: { getAll: vi.fn() },
  hobbiesAPI: { getAll: vi.fn() },
  testimonialsAPI: { getAll: vi.fn(), create: vi.fn() },
  contactMessagesAPI: { create: vi.fn() },
  resumesAPI: { getCurrentByLanguage: vi.fn(), download: vi.fn((id) => `/api/resumes/${id}/download`) },
  profileAPI: { get: vi.fn() },
  categorySettingsAPI: { getAll: vi.fn() },
  getUploadUrl: vi.fn((url) => url || ''),
}));

import {
  skillsAPI, projectsAPI, workExperienceAPI, educationAPI,
  contactInfoAPI, hobbiesAPI, testimonialsAPI, contactMessagesAPI,
  resumesAPI, profileAPI, categorySettingsAPI,
} from '../services/api';

function setupMocks() {
  profileAPI.get.mockResolvedValue({ data: { nameEn: 'John', nameFr: 'Jean', titleEn: 'Developer', titleFr: 'Développeur', bioEn: 'Bio', bioFr: 'Bio FR' } });
  skillsAPI.getAll.mockResolvedValue({ data: [{ id: '1', nameEn: 'React', nameFr: 'React', category: 'Frameworks', icon: '', order: 1 }] });
  projectsAPI.getAll.mockResolvedValue({ data: [{ id: '1', titleEn: 'Proj', titleFr: 'Proj', descriptionEn: 'D', descriptionFr: 'D', technologies: ['React'], featured: true, order: 1, startDate: '2024-01-01' }] });
  workExperienceAPI.getAll.mockResolvedValue({ data: [] });
  educationAPI.getAll.mockResolvedValue({ data: [] });
  contactInfoAPI.getAll.mockResolvedValue({ data: [{ id: '1', type: 'email', label: 'Email', value: 'test@test.com', visible: true, order: 1 }] });
  hobbiesAPI.getAll.mockResolvedValue({ data: [] });
  testimonialsAPI.getAll.mockResolvedValue({ data: [] });
  categorySettingsAPI.getAll.mockResolvedValue({ data: [] });
  resumesAPI.getCurrentByLanguage.mockResolvedValue({ data: null });
}

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
  });

  test('shows loading spinner initially', () => {
    const { container } = renderHome();
    expect(container.querySelector('.loading')).toBeInTheDocument();
  });

  test('renders main content after loading', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  test('renders skills section', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('renders project', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText('Proj')).toBeInTheDocument());
  });

  test('renders contact info', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText('test@test.com')).toBeInTheDocument());
  });

  test('handles API error gracefully', async () => {
    profileAPI.get.mockRejectedValue(new Error('fail'));
    skillsAPI.getAll.mockRejectedValue(new Error('fail'));
    projectsAPI.getAll.mockRejectedValue(new Error('fail'));
    workExperienceAPI.getAll.mockRejectedValue(new Error('fail'));
    educationAPI.getAll.mockRejectedValue(new Error('fail'));
    contactInfoAPI.getAll.mockRejectedValue(new Error('fail'));
    hobbiesAPI.getAll.mockRejectedValue(new Error('fail'));
    testimonialsAPI.getAll.mockRejectedValue(new Error('fail'));
    categorySettingsAPI.getAll.mockRejectedValue(new Error('fail'));
    renderHome();
    // Should not crash - just show empty state
    await waitFor(() => expect(document.querySelector('.loading')).not.toBeInTheDocument(), { timeout: 3000 });
  });

  test('renders work experience', async () => {
    workExperienceAPI.getAll.mockResolvedValue({ data: [
      { id: 'w1', positionEn: 'Senior Dev', positionFr: 'Dév Senior', companyEn: 'Acme', companyFr: 'Acme', descriptionEn: 'Built stuff', descriptionFr: 'Construit', startDate: '2023-01-01', endDate: null, current: true, location: 'Montreal', order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Senior Dev')).toBeInTheDocument());
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Built stuff')).toBeInTheDocument();
    expect(screen.getByText('Montreal')).toBeInTheDocument();
  });

  test('renders education', async () => {
    educationAPI.getAll.mockResolvedValue({ data: [
      { id: 'e1', degreeEn: 'BSc CS', degreeFr: 'Bac Info', institutionEn: 'MIT', institutionFr: 'MIT', fieldEn: 'Computer Science', fieldFr: 'Informatique', startDate: '2019-09-01', endDate: '2023-06-01', current: false, gpa: '3.9', order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('BSc CS')).toBeInTheDocument());
    expect(screen.getByText('MIT')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('GPA: 3.9')).toBeInTheDocument();
  });

  test('renders hobbies', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [
      { id: 'h1', nameEn: 'Photography', nameFr: 'Photo', descriptionEn: 'Love it', descriptionFr: 'Adore', featured: false, order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Photography')).toBeInTheDocument());
    expect(screen.getByText('Love it')).toBeInTheDocument();
  });

  test('renders featured hobbies with images', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [
      { id: 'h2', nameEn: 'Hiking', nameFr: 'Randonnée', descriptionEn: 'Mountain trails', descriptionFr: 'Sentiers', featured: true, imageUrl: '/img/hike.jpg', startDate: '2020-01-01', technologies: ['Outdoor'], links: [{ label: 'Blog', url: 'https://blog.com' }], order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Hiking')).toBeInTheDocument());
    expect(screen.getByText('Mountain trails')).toBeInTheDocument();
    expect(screen.getByText('Outdoor')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  test('renders testimonials section', async () => {
    testimonialsAPI.getAll.mockResolvedValue({ data: [
      { id: 't1', name: 'Jane', content: 'Amazing dev', position: 'PM', company: 'Corp', approved: true }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText(/"Amazing dev"/)).toBeInTheDocument());
    expect(screen.getByText('Jane')).toBeInTheDocument();
  });

  test('shows empty testimonials message', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText(/No testimonials yet/)).toBeInTheDocument());
  });

  test('opens and closes testimonial modal', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByText('Share Your Experience')).toBeInTheDocument());
    // Close with cancel
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => expect(screen.queryByText('Share Your Experience')).not.toBeInTheDocument());
  });

  test('submits testimonial via modal', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    vi.spyOn(Date, 'now').mockImplementation(() => 10000);
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    // Click opens modal and sets formLoadedAt = Date.now() = 10000
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    // Fill and submit
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Great work!' } });
    // Advance time so anti-spam passes (need > 3000ms)
    Date.now.mockImplementation(() => 20000);
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(testimonialsAPI.create).toHaveBeenCalled());
  });

  test('prevents fast testimonial submission', async () => {
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      return 1000; // Always same time = too fast
    });
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(screen.getByText(/Please wait a moment/)).toBeInTheDocument());
    expect(testimonialsAPI.create).not.toHaveBeenCalled();
  });

  test('submits contact form successfully', async () => {
    contactMessagesAPI.create.mockResolvedValue({});
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.change(screen.getByLabelText(/^Name \*/), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/^Email \*/), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/^Message \*/), { target: { value: 'Hello!' } });
    now = 10000;
    fireEvent.submit(screen.getByText('Send Message').closest('form'));
    await waitFor(() => expect(contactMessagesAPI.create).toHaveBeenCalled());
  });

  test('prevents fast contact form submission', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.change(screen.getByLabelText(/^Message \*/), { target: { value: 'Hello!' } });
    fireEvent.submit(screen.getByText('Send Message').closest('form'));
    await waitFor(() => expect(screen.getByText(/Please wait a moment/)).toBeInTheDocument());
  });

  test('handles contact form error', async () => {
    contactMessagesAPI.create.mockRejectedValue(new Error('fail'));
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.change(screen.getByLabelText(/^Message \*/), { target: { value: 'X' } });
    now = 10000;
    fireEvent.submit(screen.getByText('Send Message').closest('form'));
    await waitFor(() => expect(screen.getByText(/Error sending message/)).toBeInTheDocument());
  });

  test('renders multiple contact info types', async () => {
    contactInfoAPI.getAll.mockResolvedValue({ data: [
      { id: '1', type: 'email', label: 'Email', value: 'test@test.com', visible: true, order: 1 },
      { id: '2', type: 'github', label: 'GitHub', value: 'https://github.com/test', visible: true, order: 2 },
      { id: '3', type: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com/in/test', visible: true, order: 3 },
      { id: '4', type: 'location', label: 'Location', value: 'Montreal', visible: true, order: 4 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('test@test.com')).toBeInTheDocument());
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Montreal')).toBeInTheDocument();
  });

  test('renders with category settings and skill tabs', async () => {
    categorySettingsAPI.getAll.mockResolvedValue({ data: [
      { category: 'Frameworks', displayOrder: 1, speed: 4000 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Frameworks')).toBeInTheDocument());
  });

  test('renders resume download buttons', async () => {
    resumesAPI.getCurrentByLanguage.mockImplementation((lang) =>
      Promise.resolve({ data: { id: `r-${lang}`, titleEn: `Resume ${lang}` } })
    );
    renderHome();
    await waitFor(() => expect(screen.getByText('Download CV (English)')).toBeInTheDocument());
    expect(screen.getByText('Download CV (French)')).toBeInTheDocument();
  });

  test('renders project with github and live links', async () => {
    projectsAPI.getAll.mockResolvedValue({ data: [
      { id: 'p1', titleEn: 'MyProject', titleFr: 'MonProjet', descriptionEn: 'Desc', descriptionFr: 'Desc', technologies: ['Node'], featured: true, order: 1, startDate: '2024-01-01', endDate: '2024-06-01', githubUrl: 'https://github.com/x', projectUrl: 'https://example.com', imageUrl: '/img/proj.jpg' },
      { id: 'p2', titleEn: 'SmallProj', titleFr: 'PetitProj', descriptionEn: 'Small', descriptionFr: 'Petit', technologies: ['JS'], featured: false, order: 2, startDate: '2023-01-01' },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('MyProject')).toBeInTheDocument());
    expect(screen.getByText('View Live')).toBeInTheDocument();
    expect(screen.getByText('Other Projects')).toBeInTheDocument();
    expect(screen.getByText('SmallProj')).toBeInTheDocument();
  });

  test('renders footer with privacy link', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText('Privacy Policy')).toBeInTheDocument());
  });

  test('handles testimonial submit error', async () => {
    testimonialsAPI.create.mockRejectedValue({ response: { data: { error: 'Rate limited' } } });
    vi.spyOn(Date, 'now').mockImplementation(() => 10000);
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    Date.now.mockImplementation(() => 20000);
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(screen.getByText('Rate limited')).toBeInTheDocument());
  });
});
