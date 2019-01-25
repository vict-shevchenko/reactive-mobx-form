import * as React from 'react';

interface IErrorBoundaryProps {
	type: string;
}

interface IErrorBoundaryState {
	hasError: boolean;
}

export default class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h3 style={{color: '#DD4A68'}}>Error happened when trying to fetch {this.props.type}</h3>;
    }

    return this.props.children; 
  }
}
