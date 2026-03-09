import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../pages/public/Contact';

vi.mock('../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', toggleLanguage: vi.fn() }),
}));

vi.mock('../services/api', () => ({
  contactMessagesAPI: { create: vi.fn() },
}));

import { contactMessagesAPI } from '../services/api';

function renderContact() {
  return render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>
  );
}

describe('Contact', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('renders contact form', () => {
    renderContact();
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderContact();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('renders testimonial banner link', () => {
    renderContact();
    expect(screen.getByText(/Leave a testimonial/)).toBeInTheDocument();
  });

  test('submits contact form successfully', async () => {
    contactMessagesAPI.create.mockResolvedValue({});
    // We need to handle the 3-second spam check
    // Mock Date.now to return formLoadedAt + 4000
    const originalNow = Date.now;
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      // First call is in useState (formLoadedAt), subsequent calls are in handleContactSubmit
      if (callCount === 1) return 1000;
      return 5000; // 4 seconds later
    });

    renderContact();
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => expect(screen.getByText(/Message sent successfully/)).toBeInTheDocument());
    Date.now = originalNow;
  });

  test('shows error on API failure', async () => {
    contactMessagesAPI.create.mockRejectedValue(new Error('fail'));
    const originalNow = Date.now;
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      if (callCount === 1) return 1000;
      return 5000;
    });

    renderContact();
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => expect(screen.getByText(/Error sending message/)).toBeInTheDocument());
    Date.now = originalNow;
  });

  test('prevents too-fast submission (anti-spam)', async () => {
    // Date.now returns same time for formLoadedAt and submission — within 3 seconds
    let callCount = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => {
      callCount++;
      return 1000; // Always 1000 — difference is 0, which is < 3000
    });

    renderContact();
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email/), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/Message/), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send Message'));

    await waitFor(() => expect(screen.getByText(/Please wait a moment/)).toBeInTheDocument());
    expect(contactMessagesAPI.create).not.toHaveBeenCalled();
  });

  test('has back to home link', () => {
    renderContact();
    expect(screen.getByText(/Back to Home/)).toBeInTheDocument();
  });

  test('triggers honeypot field onChange', () => {
    renderContact();
    const honeypotInput = document.getElementById('website-hp-cpage');
    fireEvent.change(honeypotInput, { target: { value: 'spam' } });
    expect(honeypotInput.value).toBe('spam');
  });

  test('fills subject field', () => {
    renderContact();
    const subjectInput = screen.getByLabelText(/Subject/);
    fireEvent.change(subjectInput, { target: { value: 'Inquiry' } });
    expect(subjectInput).toHaveValue('Inquiry');
  });
});
