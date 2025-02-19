import { ErrorBase } from "@/components/error-pages/error-base";

export default function NotFound() {
  return (
    <ErrorBase
      title="404"
      message="Oops! The page you're looking for doesn't exist."
      actionText="Back to Home"
    />
  );
}
