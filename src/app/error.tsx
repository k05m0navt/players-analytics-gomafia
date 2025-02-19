"use client";

import { ErrorBase } from "@/components/error-pages/error-base";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-destructive/10 p-4">
      <div className="max-w-md text-center">
        <ErrorBase
          title="500"
          message="Something went wrong. Our team has been notified."
          actionText="Try Again"
        />
        <div className="mt-4 flex justify-center space-x-4">
          <Button onClick={() => reset()}>Retry</Button>
          <Button variant="secondary" asChild>
            <Link href="/">Home</Link>
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary>Error Details</summary>
            <pre className="bg-muted p-2 rounded-md overflow-x-auto text-sm">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
