import { auth } from "@/lib/auth";
import { Task } from "@/lib/models/Task";
import connectDB from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["todo", "in_progress", "done"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Task id required" }, { status: 400 });
    }
    const body = await request.json().catch(() => ({}));
    const updates: { status?: string; order?: number } = {};
    if (
      typeof body.status === "string" &&
      VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])
    ) {
      updates.status = body.status;
    }
    if (typeof body.order === "number") {
      updates.order = body.order;
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "Provide status and/or order" },
        { status: 400 }
      );
    }
    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updates },
      { new: true }
    );
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...task.toObject(),
      _id: task._id.toString(),
    });
  } catch (err) {
    console.error("PATCH /api/tasks/[id]", err);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
