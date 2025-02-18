"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [{ href: "/", label: "Home" }];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="text-2xl font-bold">
          GoMafia Analytics
        </Link>
        <div className="flex items-center space-x-4">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
