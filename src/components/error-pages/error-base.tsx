import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title: string;
  message: string;
  actionText?: string;
  actionLink?: string;
}

export function ErrorBase({
  title,
  message,
  actionText = "Go to Home",
  actionLink = "/",
}: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground mb-6">{message}</p>
        <Button asChild>
          <Link href={actionLink}>{actionText}</Link>
        </Button>
      </div>
    </div>
  );
}
