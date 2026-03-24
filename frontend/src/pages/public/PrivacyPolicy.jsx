import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <Seo
        title="Privacy Policy | Jose Villegas Morilla"
        description="Read the privacy policy for Jose Villegas Morilla's portfolio website, including data collection, usage, and your rights."
        path="/privacy-policy"
      />
      <header className="privacy-header">
        <div className="container">
          <Link to="/" className="back-link">&larr; Back to Home</Link>
          <h1>Privacy Policy</h1>
          <div style={{ width: '120px' }}></div>
        </div>
      </header>

      <main className="privacy-content">
        <div className="container">
          <p className="last-updated">Last updated: March 3, 2026</p>

          <h2>1. Introduction</h2>
          <p>
            Welcome to Jose Villegas Morilla's portfolio website ("the Website"). Your privacy is important to me.
            This Privacy Policy explains how I collect, use, and protect information when you visit the Website.
          </p>

          <h2>2. Information I Collect</h2>
          <p>The Website may collect the following types of information:</p>
          <ul>
            <li><strong>Contact Form Data:</strong> When you use the contact form, I collect your name, email address, subject, and message content. This information is used solely to respond to your inquiry.</li>
            <li><strong>Testimonial Submissions:</strong> If you voluntarily submit a testimonial, I collect your name, company (if provided), project name, and testimonial content.</li>
            <li><strong>Server Logs:</strong> Standard server logs may record your IP address, browser type, and pages visited. This data is used for security and performance monitoring only.</li>
          </ul>

          <h2>3. How I Use Your Information</h2>
          <p>Information collected through the Website is used to:</p>
          <ul>
            <li>Respond to inquiries submitted via the contact form</li>
            <li>Display approved testimonials on the Website</li>
            <li>Maintain the security and performance of the Website</li>
          </ul>

          <h2>4. Cookies and Tracking</h2>
          <p>
            The Website does not use cookies for tracking purposes or to store personal information. 
            No third-party analytics cookies or advertising trackers are employed.
            The hosting provider (Vercel) may collect minimal analytics data for performance monitoring.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>The Website uses the following third-party services:</p>
          <ul>
            <li><strong>Vercel:</strong> Website hosting and deployment</li>
            <li><strong>Railway:</strong> Backend API hosting</li>
            <li><strong>Google Fonts:</strong> Font delivery (subject to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>)</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            Contact form submissions and testimonials are retained for as long as necessary to fulfill the purposes
            described in this policy. You may request deletion of your data at any time by contacting me.
          </p>

          <h2>7. Data Security</h2>
          <p>
            I take reasonable measures to protect your information, including HTTPS encryption for all data
            transmitted between your browser and the Website, and secure storage practices for submitted data.
          </p>

          <h2>8. Your Rights (GDPR)</h2>
          <p>If you are a resident of the European Union, you have the right to:</p>
          <ul>
            <li>Access the personal data I hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
          </ul>
          <p>
            To exercise any of these rights, please contact me using the contact information provided on the Website.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            The Website is not directed at individuals under the age of 16. I do not knowingly collect personal
            information from children.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            I may update this Privacy Policy from time to time. Any changes will be reflected on this page
            with an updated revision date.
          </p>

          <h2>11. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please reach out via the <Link to="/contact">contact page</Link>.
          </p>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Jose Villegas Morilla</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
