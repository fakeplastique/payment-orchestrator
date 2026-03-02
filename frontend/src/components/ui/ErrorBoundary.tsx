'use client';

import { Component, ReactNode } from 'react';
import { clearFetchCache } from '@/lib/useFetch';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    clearFetchCache();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>
            Failed to load data. Is the backend running?
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '8px 16px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              width: 'fit-content',
              fontSize: 13,
            }}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
