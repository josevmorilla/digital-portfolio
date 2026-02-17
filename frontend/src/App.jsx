import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Public pages
import Home from './pages/public/Home';
import Contact from './pages/public/Contact';
import Testimonials from './pages/public/Testimonials';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSkills from './pages/admin/AdminSkills';
import AdminProjects from './pages/admin/AdminProjects';
import AdminWorkExperience from './pages/admin/AdminWorkExperience';
import AdminEducation from './pages/admin/AdminEducation';
import AdminContactInfo from './pages/admin/AdminContactInfo';
import AdminHobbies from './pages/admin/AdminHobbies';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminMessages from './pages/admin/AdminMessages';
import AdminResumes from './pages/admin/AdminResumes';
import AdminProfile from './pages/admin/AdminProfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />

            {/* Admin Routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
            <Route path="/work-experience" element={<ProtectedRoute><AdminWorkExperience /></ProtectedRoute>} />
            <Route path="/education" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
            <Route path="/contact-info" element={<ProtectedRoute><AdminContactInfo /></ProtectedRoute>} />
            <Route path="/hobbies" element={<ProtectedRoute><AdminHobbies /></ProtectedRoute>} />
            <Route path="/review-testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
            <Route path="/resumes" element={<ProtectedRoute><AdminResumes /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
