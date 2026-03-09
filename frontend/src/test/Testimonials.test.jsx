import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Testimonials from '../pages/public/Testimonials';

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', toggleLanguage: vi.fn() }),
}));

vi.mock('../services/api', () => ({
  testimonialsAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
  },
  getUploadUrl: vi.fn((url) => url || ''),
}));

import { testimonialsAPI } from '../services/api';

function renderTestimonials() {
  return render(
    <MemoryRouter>
      <Testimonials />
    </MemoryRouter>
  );
}

describe('Testimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    testimonialsAPI.getAll.mockResolvedValue({ data: [{ id: '1', name: 'Alice', content: 'Great!', company: 'Acme', position: 'CTO', approved: true }] });
  });

  test('renders testimonials page', async () => {
    renderTestimonials();
    expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Great!')).toBeInTheDocument());
  });

  test('renders submission form', () => {
    renderTestimonials();
    expect(screen.getByText('Write Your Testimonial')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Experience/)).toBeInTheDocument();
  });

  test('renders approved testimonials', async () => {
    renderTestimonials();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    expect(screen.getByText(/Acme/)).toBeInTheDocument();
  });

  test('submits a testimonial', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 1000;
      return 5000;
    });

    renderTestimonials();
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Amazing work!' } });
    fireEvent.click(screen.getByText('Submit Testimonial'));

    await waitFor(() => expect(testimonialsAPI.create).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Thank you for your testimonial/)).toBeInTheDocument());
  });

  test('handles submit error', async () => {
    testimonialsAPI.create.mockRejectedValue({ response: { data: { error: 'Too many submissions' } } });
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 1000;
      return 5000;
    });

    renderTestimonials();
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Submit Testimonial'));

    await waitFor(() => expect(screen.getByText('Too many submissions')).toBeInTheDocument());
  });

  test('prevents too-fast submission', async () => {
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      return 1000;
    });

    renderTestimonials();
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Submit Testimonial'));

    await waitFor(() => expect(screen.getByText(/Please wait a moment/)).toBeInTheDocument());
    expect(testimonialsAPI.create).not.toHaveBeenCalled();
  });

  test('shows navigation links', () => {
    renderTestimonials();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('shows empty testimonials state', async () => {
    testimonialsAPI.getAll.mockResolvedValue({ data: [] });
    renderTestimonials();
    // When no testimonials, the showcase section is not rendered
    await waitFor(() => expect(screen.getByText('Share Your Experience')).toBeInTheDocument());
    expect(screen.queryByText('What Others Are Saying')).not.toBeInTheDocument();
  });

  test('fills all form fields', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);

    renderTestimonials();
    fireEvent.change(screen.getByLabelText(/Your Name/), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Project/), { target: { value: 'WebApp' } });
    fireEvent.change(screen.getByLabelText(/Company/), { target: { value: 'Corp' } });
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Excellent!' } });
    now = 10000;
    fireEvent.click(screen.getByText('Submit Testimonial'));
    await waitFor(() => expect(testimonialsAPI.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Bob', company: 'Corp', content: 'Excellent!' })
    ));
  });

  test('shows Write Another button after submission', async () => {
    testimonialsAPI.create.mockResolvedValue({});
    let now = 1000;
    vi.spyOn(Date, 'now').mockImplementation(() => now);

    renderTestimonials();
    fireEvent.change(screen.getByLabelText(/Your Experience/), { target: { value: 'Nice!' } });
    now = 10000;
    fireEvent.click(screen.getByText('Submit Testimonial'));
    await waitFor(() => expect(screen.getByText('Write Another Testimonial')).toBeInTheDocument());
    // Click to show form again
    fireEvent.click(screen.getByText('Write Another Testimonial'));
    expect(screen.getByText('Submit Testimonial')).toBeInTheDocument();
  });

  test('shows testimonial card with position and company', async () => {
    renderTestimonials();
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    // Position "CTO" and company "at Acme" in same element
    expect(screen.getByText(/CTO/)).toBeInTheDocument();
  });

  test('renders language toggle button', () => {
    renderTestimonials();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  test('renders footer with contact link', () => {
    renderTestimonials();
    expect(screen.getByText('Visit the contact page')).toBeInTheDocument();
  });
});
