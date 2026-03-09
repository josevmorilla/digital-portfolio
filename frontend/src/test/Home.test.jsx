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

  test('handles testimonial submit error without response', async () => {
    testimonialsAPI.create.mockRejectedValue(new Error('Network'));
    vi.spyOn(Date, 'now').mockImplementation(() => 10000);
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    Date.now.mockImplementation(() => 20000);
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(screen.getByText(/Error submitting testimonial/)).toBeInTheDocument());
  });

  test('toggles mobile menu', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    const hamburger = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburger);
    expect(hamburger.className).toContain('open');
    fireEvent.click(hamburger);
    expect(hamburger.className).not.toContain('open');
  });

  test('logo click scrolls to top', async () => {
    globalThis.scrollTo = vi.fn();
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    // Logo button contains the profile name
    const logos = screen.getAllByText('John');
    const logoButton = logos.find(el => el.tagName === 'BUTTON');
    fireEvent.click(logoButton);
    expect(globalThis.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('closes mobile menu when nav link clicked', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    const hamburger = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburger);
    // Click a nav link - use the anchor element specifically
    const skillsLink = screen.getByText('Skills', { selector: 'a' });
    fireEvent.click(skillsLink);
  });

  test('skills carousel prev/next navigation', async () => {
    // Need > 6 skills to get multiple slides
    const manySkills = Array.from({ length: 8 }, (_, i) => ({
      id: String(i + 1), nameEn: `Skill${i}`, nameFr: `Skill${i}`, category: 'Frameworks', icon: '', order: i + 1,
    }));
    skillsAPI.getAll.mockResolvedValue({ data: manySkills });
    categorySettingsAPI.getAll.mockResolvedValue({ data: [
      { category: 'Frameworks', displayOrder: 1, speed: 999999 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Skill0')).toBeInTheDocument());
    // Click next
    fireEvent.click(screen.getByLabelText('Next skills'));
    await waitFor(() => expect(screen.getByText('Skill6')).toBeInTheDocument());
    // Click prev
    fireEvent.click(screen.getByLabelText('Previous skills'));
    await waitFor(() => expect(screen.getByText('Skill0')).toBeInTheDocument());
  });

  test('closes testimonial toast', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    vi.spyOn(Date, 'now').mockImplementation(() => 10000);
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Great!' } });
    Date.now.mockImplementation(() => 20000);
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(screen.getByText(/Thank you/)).toBeInTheDocument());
    // Close toast
    fireEvent.click(screen.getByText('×'));
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
  });

  test('changes contact subject field', async () => {
    contactMessagesAPI.create.mockResolvedValue({});
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.change(screen.getByLabelText(/^Name \*/), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText(/^Email \*/), { target: { value: 'u@t.com' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Hello' } });
    fireEvent.change(screen.getByLabelText(/^Message \*/), { target: { value: 'Msg' } });
    now = 10000;
    fireEvent.submit(screen.getByText('Send Message').closest('form'));
    await waitFor(() => expect(contactMessagesAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({ subject: 'Hello' })
    ));
  });

  test('fills testimonial form fields', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    vi.spyOn(Date, 'now').mockImplementation(() => 10000);
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText('Company/Role'), { target: { value: 'Acme' } });
    fireEvent.change(screen.getByLabelText('Project'), { target: { value: 'MyProject' } });
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Great!' } });
    Date.now.mockImplementation(() => 20000);
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(testimonialsAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Alice', company: 'Acme', position: 'MyProject' })
    ));
  });

  test('closes testimonial modal via X button', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByText('Share Your Experience')).toBeInTheDocument());
    // Close via the × button on the modal
    const closeBtn = screen.getByText('×');
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByText('Share Your Experience')).not.toBeInTheDocument());
  });

  test('renders profile without bio', async () => {
    profileAPI.get.mockResolvedValue({ data: { nameEn: 'John', nameFr: 'Jean', titleEn: 'Dev', titleFr: 'Dév', bioEn: '', bioFr: '' } });
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    expect(screen.queryByText('Bio')).not.toBeInTheDocument();
  });

  test('renders contact location type', async () => {
    contactInfoAPI.getAll.mockResolvedValue({ data: [
      { id: '4', type: 'location', label: 'Location', value: 'Montreal', visible: true, order: 1 },
      { id: '5', type: 'phone', label: 'Phone', value: '555-1234', visible: true, order: 2 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Montreal')).toBeInTheDocument());
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  test('renders non-featured project with github link', async () => {
    projectsAPI.getAll.mockResolvedValue({ data: [
      { id: 'p2', titleEn: 'Small', titleFr: 'Petit', descriptionEn: 'D', descriptionFr: 'D', technologies: [], featured: false, order: 1, startDate: '2023-01-01', githubUrl: 'https://github.com/x', projectUrl: 'https://example.com' },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Small')).toBeInTheDocument());
  });

  test('renders featured hobby without image', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [
      { id: 'h3', nameEn: 'Gaming', nameFr: 'Jeux', descriptionEn: 'Fun', descriptionFr: 'Amusant', featured: true, imageUrl: null, startDate: '2020-01-01', technologies: [], links: [], order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Gaming')).toBeInTheDocument());
  });

  test('renders featured hobby with github link', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [
      { id: 'h4', nameEn: 'Coding', nameFr: 'Code', descriptionEn: 'Love it', descriptionFr: 'Adore', featured: true, imageUrl: '/img.jpg', startDate: null, technologies: [], links: [{ label: 'GitHub Repo', url: 'https://github.com/test' }], order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Coding')).toBeInTheDocument());
    expect(screen.getByText('GitHub Repo')).toBeInTheDocument();
  });

  test('renders hobby link without http prefix', async () => {
    hobbiesAPI.getAll.mockResolvedValue({ data: [
      { id: 'h5', nameEn: 'Art', nameFr: 'Art', descriptionEn: 'Creative', descriptionFr: 'Créatif', featured: true, imageUrl: null, startDate: null, technologies: [], links: [{ label: 'Site', url: 'example.com' }], order: 1 }
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Art')).toBeInTheDocument());
    const link = screen.getByText('Site').closest('a');
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  test('renders project without image', async () => {
    projectsAPI.getAll.mockResolvedValue({ data: [
      { id: 'p3', titleEn: 'NoImg', titleFr: 'NoImg', descriptionEn: 'D', descriptionFr: 'D', technologies: [], featured: true, order: 1, startDate: '2024-01-01', imageUrl: null },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('NoImg')).toBeInTheDocument());
  });

  test('closes modal via overlay button', async () => {
    renderHome();
    await waitFor(() => expect(screen.getByText(/Leave a Testimonial/)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByText('Share Your Experience')).toBeInTheDocument());
    const overlayClose = screen.getByLabelText('Close modal');
    fireEvent.click(overlayClose);
    await waitFor(() => expect(screen.queryByText('Share Your Experience')).not.toBeInTheDocument());
  });

  test('renders linkedin and github hero icons', async () => {
    contactInfoAPI.getAll.mockResolvedValue({ data: [
      { id: '1', type: 'email', label: 'Email', value: 'test@test.com', visible: true, order: 1 },
      { id: '2', type: 'github', label: 'GitHub', value: 'https://github.com/user', visible: true, order: 2 },
      { id: '3', type: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com/in/user', visible: true, order: 3 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('test@test.com')).toBeInTheDocument());
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  test('toggles language button', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    const langBtn = screen.getByText('FR');
    fireEvent.click(langBtn);
  });

  test('contact form error sets error message', async () => {
    contactMessagesAPI.create.mockRejectedValue(new Error('Network'));
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    now = 10000;
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('Email *'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Message *'), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByText('Send Message'));
    await waitFor(() => expect(screen.getByText(/Error sending message/)).toBeInTheDocument());
  });

  test('clicking skill tab switches active tab', async () => {
    categorySettingsAPI.getAll.mockResolvedValue({ data: [
      { category: 'Frameworks', displayOrder: 1, speed: 5 },
      { category: 'Tools', displayOrder: 2, speed: 5 },
    ] });
    skillsAPI.getAll.mockResolvedValue({ data: [
      { id: '1', nameEn: 'React', nameFr: 'React', category: 'Frameworks', icon: '', order: 1 },
      { id: '2', nameEn: 'Docker', nameFr: 'Docker', category: 'Tools', icon: '', order: 1 },
    ] });
    renderHome();
    await waitFor(() => expect(screen.getByText('Tools')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Tools'));
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  test('triggers testimonial honeypot onChange', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    // Open testimonial modal
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    const input = document.getElementById('website-hp-testimonial');
    fireEvent.change(input, { target: { value: 'bot' } });
    expect(input.value).toBe('bot');
  });

  test('triggers contact honeypot onChange', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    const input = document.getElementById('website-hp-contact');
    fireEvent.change(input, { target: { value: 'bot' } });
    expect(input.value).toBe('bot');
  });

  test('clicking mobile nav links closes menu', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    const hamburger = screen.getByLabelText('Toggle menu');
    fireEvent.click(hamburger);
    // Click each nav link to trigger setMobileMenuOpen(false)
    const navLinks = document.querySelectorAll('.nav-links a');
    for (const link of navLinks) {
      fireEvent.click(hamburger); // re-open
      fireEvent.click(link);
    }
  });

  test('carousel auto-advances with many skills', async () => {
    vi.useFakeTimers();
    categorySettingsAPI.getAll.mockResolvedValue({ data: [
      { category: 'Frameworks', displayOrder: 1, speed: 1000 },
    ] });
    // Need > 6 skills to trigger total > 1 (skillsPerSlide is 6)
    const manySkills = Array.from({ length: 8 }, (_, i) => ({
      id: String(i), nameEn: `Skill${i}`, nameFr: `Skill${i}`, category: 'Frameworks', icon: '', order: i,
    }));
    skillsAPI.getAll.mockResolvedValue({ data: manySkills });
    renderHome();
    await vi.waitFor(() => expect(screen.getByText('Skill0')).toBeInTheDocument());
    vi.advanceTimersByTime(2000);
    vi.useRealTimers();
  });

  test('testimonial modal escape key closes modal', async () => {
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    const overlay = screen.getByLabelText('Close modal');
    fireEvent.keyDown(overlay, { key: 'Escape' });
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  test('testimonial form anti-spam on Home page', async () => {
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
    fireEvent.click(screen.getByText(/Leave a Testimonial/));
    await waitFor(() => expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    fireEvent.submit(screen.getByText('Submit').closest('form'));
    await waitFor(() => expect(screen.getByText(/Please wait a moment/)).toBeInTheDocument());
  });

  test('resume fetch error is handled', async () => {
    resumesAPI.getCurrentByLanguage.mockRejectedValue(new Error('fail'));
    renderHome();
    await waitFor(() => expect(screen.getAllByText('John').length).toBeGreaterThan(0));
  });
});
