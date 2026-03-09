import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock all page components to avoid complex dependency chains
vi.mock('../pages/public/Home', () => ({ default: () => <div>Home Page</div> }));
vi.mock('../pages/public/Contact', () => ({ default: () => <div>Contact Page</div> }));
vi.mock('../pages/public/Testimonials', () => ({ default: () => <div>Testimonials Page</div> }));
vi.mock('../pages/public/PrivacyPolicy', () => ({ default: () => <div>Privacy Policy Page</div> }));
vi.mock('../pages/public/ErrorPage', () => ({ default: ({ code }) => <div>Error {code || 404}</div> }));
vi.mock('../pages/admin/AdminLogin', () => ({ default: () => <div>Login Page</div> }));
vi.mock('../pages/admin/AdminDashboard', () => ({ default: () => <div>Dashboard</div> }));
vi.mock('../pages/admin/AdminSkills', () => ({ default: () => <div>Skills</div> }));
vi.mock('../pages/admin/AdminProjects', () => ({ default: () => <div>Projects</div> }));
vi.mock('../pages/admin/AdminWorkExperience', () => ({ default: () => <div>Work Experience</div> }));
vi.mock('../pages/admin/AdminEducation', () => ({ default: () => <div>Education</div> }));
vi.mock('../pages/admin/AdminContactInfo', () => ({ default: () => <div>Contact Info</div> }));
vi.mock('../pages/admin/AdminHobbies', () => ({ default: () => <div>Hobbies</div> }));
vi.mock('../pages/admin/AdminTestimonials', () => ({ default: () => <div>Admin Testimonials</div> }));
vi.mock('../pages/admin/AdminMessages', () => ({ default: () => <div>Messages</div> }));
vi.mock('../pages/admin/AdminResumes', () => ({ default: () => <div>Resumes</div> }));
vi.mock('../pages/admin/AdminProfile', () => ({ default: () => <div>Profile</div> }));

describe('App', () => {
  test('renders home page on /', () => {
    render(<App />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  test('renders contact page on /contact', () => {
    // App uses BrowserRouter internally, so we need to manipulate window.location
    window.history.pushState({}, '', '/contact');
    render(<App />);
    expect(screen.getByText('Contact Page')).toBeInTheDocument();
  });

  test('renders testimonials page on /testimonials', () => {
    window.history.pushState({}, '', '/testimonials');
    render(<App />);
    expect(screen.getByText('Testimonials Page')).toBeInTheDocument();
  });

  test('renders privacy policy page on /privacy-policy', () => {
    window.history.pushState({}, '', '/privacy-policy');
    render(<App />);
    expect(screen.getByText('Privacy Policy Page')).toBeInTheDocument();
  });

  test('renders login page on /login', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  test('renders 404 for unknown routes', () => {
    window.history.pushState({}, '', '/unknown-route');
    render(<App />);
    expect(screen.getByText('Error 404')).toBeInTheDocument();
  });
});
