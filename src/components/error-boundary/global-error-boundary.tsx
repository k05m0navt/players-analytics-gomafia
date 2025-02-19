"use client";

import React, { ErrorInfo } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class GlobalErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-destructive/10 p-4">
          <div className="max-w-md text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-destructive" />
            <h1 className="text-2xl font-bold text-destructive mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-4">
              We encountered an unexpected error. Please try again or contact
              support.
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => window.location.reload()}>
                Reload Page
              </Button>
              <Button variant="secondary" onClick={this.handleReset}>
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary>Error Details</summary>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto text-sm">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
