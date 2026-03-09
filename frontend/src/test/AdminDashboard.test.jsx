import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';

const mockLogout = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'Test Admin' }, logout: mockLogout }),
}));

vi.mock('react-icons/fi', () => ({
  FiCode: () => <span>FiCode</span>,
  FiBriefcase: () => <span>FiBriefcase</span>,
  FiBook: () => <span>FiBook</span>,
  FiUser: () => <span>FiUser</span>,
  FiMail: () => <span>FiMail</span>,
  FiHeart: () => <span>FiHeart</span>,
  FiMessageSquare: () => <span>FiMessageSquare</span>,
  FiFileText: () => <span>FiFileText</span>,
  FiInbox: () => <span>FiInbox</span>,
  FiEye: () => <span>FiEye</span>,
  FiCheckCircle: () => <span>FiCheckCircle</span>,
  FiLogOut: () => <span>FiLogOut</span>,
  FiSettings: () => <span>FiSettings</span>,
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
}

describe('AdminDashboard', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  test('renders dashboard header with user name', () => {
    renderDashboard();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Test Admin')).toBeInTheDocument();
  });

  test('renders all section cards', () => {
    renderDashboard();
    const sectionNames = ['Profile', 'Skills', 'Projects', 'Work Experience', 'Education', 'Contact Info', 'Hobbies', 'Testimonials', 'Messages', 'Resumes'];
    for (const name of sectionNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  test('renders quick action links', () => {
    renderDashboard();
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText(/View Public Site/)).toBeInTheDocument();
    expect(screen.getByText(/View Messages/)).toBeInTheDocument();
    expect(screen.getByText(/Approve Testimonials/)).toBeInTheDocument();
  });

  test('calls logout when button is clicked', () => {
    renderDashboard();
    fireEvent.click(screen.getByText(/Logout/));
    expect(mockLogout).toHaveBeenCalled();
  });

  test('section cards link to correct paths', () => {
    renderDashboard();
    const skillsLink = screen.getByText('Skills').closest('a');
    expect(skillsLink).toHaveAttribute('href', '/skills');
    const projectsLink = screen.getByText('Projects').closest('a');
    expect(projectsLink).toHaveAttribute('href', '/projects');
  });
});
