import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('apexdrive_current_page');
      sessionStorage.removeItem('apexdrive_selected_service');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            color: '#ffffff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1.5px solid #ef4444',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '24px',
              }}
            >
              ⚠️
            </div>
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: '#f8fafc',
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                marginBottom: '1rem',
                lineHeight: 1.5,
              }}
            >
              The application encountered a temporary display issue. Click below to return to the home page.
            </p>
            {this.state.error && (
              <pre
                style={{
                  background: '#0f172a',
                  color: '#f87171',
                  padding: '0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '1.25rem',
                  maxHeight: '120px',
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Reset &amp; Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
