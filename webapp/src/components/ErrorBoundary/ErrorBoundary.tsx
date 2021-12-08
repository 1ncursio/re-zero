import { Component, ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};
type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

// Error boundaries currently have to be classes.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  //   state = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  render() {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      return fallback;
    }
    return children;
  }
}

export default ErrorBoundary;
