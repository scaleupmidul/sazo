import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#FEF2F2', 
          padding: '20px',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '32px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
            maxWidth: '500px', 
            width: '100%',
            border: '1px solid #FECACA'
          }}>
            <h1 style={{ color: '#DC2626', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Something went wrong</h1>
            <p style={{ color: '#4B5563', marginBottom: '16px' }}>The application encountered an unexpected error.</p>
            <pre style={{ 
              backgroundColor: '#F3F4F6', 
              padding: '16px', 
              borderRadius: '8px', 
              fontSize: '12px', 
              overflow: 'auto', 
              color: '#991B1B',
              marginBottom: '24px'
            }}>
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.href = '/'} 
              style={{ 
                width: '100%', 
                backgroundColor: '#DB2777', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '12px', 
                borderRadius: '8px', 
                border: 'none', 
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
