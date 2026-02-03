import mongoose from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface ITask {
  _id: mongoose.Types.ObjectId;
  title: string;
  status: TaskStatus;
  order: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    order: { type: Number, required: true, default: 0 },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Task =
  mongoose.models.Task ?? mongoose.model<ITask>("Task", taskSchema);
