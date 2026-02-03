import connectDB from "@/lib/db";
import { Task } from "@/lib/models/Task";

export interface SerializedTask {
  _id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  order: number;
  userId: string;
}

export async function getTasksForUser(userId: string): Promise<SerializedTask[]> {
  await connectDB();
  const tasks = await Task.find({ userId })
    .sort({ status: 1, order: 1 })
    .lean();
  return tasks.map((t) => ({
    ...t,
    _id: t._id.toString(),
  })) as SerializedTask[];
}
