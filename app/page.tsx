import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-background">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--chart-1)/15%,transparent)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-chart-2/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-chart-3/5 blur-3xl" />

      <main className="relative flex flex-1 flex-col items-center justify-center px-4">
        <section className="container mx-auto grid items-center gap-12 px-4 py-24 text-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:text-left">
          <div className="mx-auto max-w-2xl">
            <h1 className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Track your time,
              <span className="block bg-linear-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                manage your projects
              </span>
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-4 mx-auto mt-6 max-w-xl text-lg text-muted-foreground [animation-delay:150ms] fill-mode-[both] lg:mx-0">
              Organize your tasks, track your time, and get things done. Simple,
              fast, and focused on what matters.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom-4 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center [animation-delay:300ms] fill-mode-[both] lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:shadow-primary/30 focus-visible:-translate-y-0.5"
              >
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-semibold border-border/80 bg-background/80 backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-muted/60 focus-visible:-translate-y-0.5 dark:border-white/15"
              >
                <Link href="#features">Learn more</Link>
              </Button>
            </div>

            <div
              id="features"
              className="mt-12 flex flex-wrap justify-center gap-3 text-sm font-medium text-muted-foreground lg:justify-start"
            >
              {["Time tracking", "Project views", "Smart reminders", "Reports"].map(
                (feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-border/80 px-4 py-2 text-foreground"
                  >
                    {feature}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative order-first w-full max-w-2xl justify-self-center sm:max-w-3xl lg:order-0 lg:justify-self-end">
            <div
              className="pointer-events-none absolute inset-0 -z-10 translate-y-6 rounded-[32px] bg-linear-to-r from-chart-1/25 via-chart-2/25 to-chart-3/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative rounded-[32px] border border-white/10 bg-surface/80 p-1 shadow-2xl shadow-primary/25 ring-1 ring-primary/10 backdrop-blur">
              <div className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-background to-surface">
                <Image
                  src="/images/hero.png"
                  alt="Dashboard preview of time tracking analytics"
                  width={1280}
                  height={960}
                  priority
                  quality={90}
                  sizes="(min-width: 1024px) 600px, 90vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 left-1/2 w-[85%] -translate-x-1/2 rounded-2xl border border-border/70 bg-background/95 px-6 py-4 text-left shadow-xl shadow-primary/10 backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Hours logged this week
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">48h 12m</p>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-success">
                  <span className="size-2 rounded-full bg-success" />
                  +12% vs last week
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
