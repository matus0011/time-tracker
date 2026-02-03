"use client";

import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth/auth-client";
import { Briefcase, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="group flex items-center gap-2 text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-hover:-rotate-6">
            <Briefcase className="size-5" />
          </span>
          Job Time Tracker
        </Link>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted/70 hover:text-foreground/80"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted/70 hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-foreground hover:bg-muted/70 hover:text-foreground/80"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="shadow-sm shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:shadow-primary/30 focus-visible:-translate-y-0.5"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
