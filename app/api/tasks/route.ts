import { auth } from "@/lib/auth";
import { Task } from "@/lib/models/Task";
import connectDB from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const tasks = await Task.find({ userId: session.user.id })
      .sort({ status: 1, order: 1 })
      .lean();
    const serialized = tasks.map((t) => ({
      ...t,
      _id: t._id.toString(),
    }));
    return NextResponse.json(serialized);
  } catch (err) {
    console.error("GET /api/tasks", err);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    await connectDB();
    const maxOrder = await Task.findOne(
      { userId: session.user.id, status: "todo" },
      {},
      { sort: { order: -1 } }
    ).select("order");
    const order = (maxOrder?.order ?? -1) + 1;
    const task = await Task.create({
      title,
      status: "todo",
      order,
      userId: session.user.id,
    });
    return NextResponse.json({
      ...task.toObject(),
      _id: task._id.toString(),
    });
  } catch (err) {
    console.error("POST /api/tasks", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
