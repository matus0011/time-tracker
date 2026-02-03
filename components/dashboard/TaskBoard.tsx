"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  _id: string;
  title: string;
  status: TaskStatus;
  order: number;
  userId?: string;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "Do zrobienia" },
  { id: "in_progress", title: "W toku" },
  { id: "done", title: "Zrobione" },
];

function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
    data: { task },
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing touch-none",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
      {...listeners}
      {...attributes}
    >
      <CardContent className="py-3 px-4">
        <p className="text-sm font-medium text-foreground">{task.title}</p>
      </CardContent>
    </Card>
  );
}

function Column({
  id,
  title,
  tasks,
}: {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-1 min-w-0 flex-col rounded-xl border border-border/70 bg-background/80 p-4 shadow-lg backdrop-blur transition-colors",
        isOver && "ring-2 ring-chart-1 ring-offset-2 ring-offset-background"
      )}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        {title}
      </h3>
      <div className="flex flex-col gap-2 min-h-[120px]">
        {tasks
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
      </div>
    </div>
  );
}

export function TaskBoard({ initialTasks = [] }: { initialTasks?: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const addTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || isSubmitting) return;
    setIsSubmitting(true);
    setNewTitle("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add task");
      }
      const task: Task = await res.json();
      setTasks((prev) => [...prev, task]);
    } catch (err) {
      console.error(err);
      setNewTitle(title);
    } finally {
      setIsSubmitting(false);
    }
  }, [newTitle, isSubmitting]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const taskId = String(active.id);
      const overId = String(over.id);
      const newStatus: TaskStatus | null = COLUMNS.some((c) => c.id === overId)
        ? (overId as TaskStatus)
        : (tasks.find((t) => t._id === overId)?.status ?? null);
      if (!newStatus) return;
      const task = tasks.find((t) => t._id === taskId);
      if (!task || task.status === newStatus) return;

      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );

      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) {
          setTasks((prev) =>
            prev.map((t) =>
              t._id === taskId ? { ...t, status: task.status } : t
            )
          );
        }
      } catch {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId ? { ...t, status: task.status } : t
          )
        );
      }
    },
    [tasks]
  );

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={addTask}
        className="flex flex-wrap items-center gap-2"
      >
        <Input
          placeholder="Nazwa zadania..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="max-w-xs"
          disabled={isSubmitting}
        />
        <Button type="submit" disabled={isSubmitting || !newTitle.trim()}>
          Dodaj
        </Button>
      </form>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter((t) => t.status === col.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
