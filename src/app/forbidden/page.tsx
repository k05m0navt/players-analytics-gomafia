import { ErrorBase } from "@/components/error-pages/error-base";

export default function Forbidden() {
  return (
    <ErrorBase
      title="403"
      message="You don't have permission to access this page."
      actionText="Back to Safety"
    />
  );
}
