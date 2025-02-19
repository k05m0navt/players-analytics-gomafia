"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PageErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Page Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-destructive/10 p-4">
      <div className="max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h2 className="text-xl font-semibold text-destructive mb-2">
          Failed to Load Page
        </h2>
        <p className="text-muted-foreground mb-4">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
