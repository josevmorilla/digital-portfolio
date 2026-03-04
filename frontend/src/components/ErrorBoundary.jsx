import React from 'react';
import '../pages/public/ErrorPage.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // If fallback="silent", render nothing (used for analytics wrappers)
      if (this.props.fallback === 'silent') {
        return null;
      }

      return (
        <div className="error-page">
          <div className="error-page-content">
            <div className="error-page-code">500</div>
            <div className="error-page-divider" />
            <h1 className="error-page-title">Something Went Wrong</h1>
            <p className="error-page-message">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="error-page-actions">
              <button
                className="error-page-btn error-page-btn-primary"
                onClick={this.handleReload}
              >
                Go Home
              </button>
              <button
                className="error-page-btn error-page-btn-secondary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
