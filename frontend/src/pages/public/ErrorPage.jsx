import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import './ErrorPage.css';

const ERROR_DATA = {
  400: {
    title: 'Bad Request',
    message: 'The server could not understand your request. Please check and try again.',
  },
  401: {
    title: 'Unauthorized',
    message: 'You need to be logged in to access this page.',
  },
  403: {
    title: 'Forbidden',
    message: 'You don\u2019t have permission to access this resource.',
  },
  404: {
    title: 'Page Not Found',
    message: 'The page you\u2019re looking for doesn\u2019t exist or has been moved.',
  },
  500: {
    title: 'Internal Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  503: {
    title: 'Service Unavailable',
    message: 'The server is temporarily unavailable. Please try again in a few minutes.',
  },
};

const DEFAULT_ERROR = {
  title: 'Something Went Wrong',
  message: 'An unexpected error occurred. Please try again.',
};

export default function ErrorPage({ code = 404, title, message }) {
  const location = useLocation();

  // Allow override from location state (useful for programmatic navigation)
  const stateCode = location.state?.code || code;
  const errorInfo = ERROR_DATA[stateCode] || DEFAULT_ERROR;

  const displayTitle = title || location.state?.title || errorInfo.title;
  const displayMessage = message || location.state?.message || errorInfo.message;

  return (
    <div className="error-page">
      <div className="error-page-content">
        <div className="error-page-code">{stateCode}</div>
        <div className="error-page-divider" />
        <h1 className="error-page-title">{displayTitle}</h1>
        <p className="error-page-message">{displayMessage}</p>
        <div className="error-page-actions">
          <Link to="/" className="error-page-btn error-page-btn-primary">
            Go Home
          </Link>
          <button
            className="error-page-btn error-page-btn-secondary"
            onClick={() => globalThis.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

ErrorPage.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string,
  message: PropTypes.string,
};
