import { auth } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tasks";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const initialTasks = await getTasksForUser(session.user.id);

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col overflow-hidden bg-background">
      {/* Subtle gradient background – matches main page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--chart-1)/15%,transparent)]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-chart-2/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-64 w-64 rounded-full bg-chart-3/5 blur-3xl" />

      <main className="relative flex flex-1 flex-col px-4 py-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome,{" "}
            <span className="bg-linear-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              {session.user.name}
            </span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You are signed in as {session.user.email}
          </p>

          {/* Quick stats placeholder – matches hero card style */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/80 px-6 py-5 shadow-lg backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Hours this week
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">0h 0m</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-chart-1" />
                Start tracking time
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-6 py-5 shadow-lg backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Projects
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">0</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-chart-2" />
                Add your first project
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/80 px-6 py-5 shadow-lg backdrop-blur">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Tasks completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">0</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 rounded-full bg-chart-3" />
                Track progress
              </div>
            </div>
          </div>

          {/* Kanban zadań */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Zadania
            </h2>
            <TaskBoard initialTasks={initialTasks} />
          </section>
        </div>
      </main>
    </div>
  );
}
