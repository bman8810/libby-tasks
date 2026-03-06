import { NextRequest, NextResponse } from "next/server";
import { readTasks, writeTasks } from "@/lib/tasks";
import { Task } from "@/lib/types";

export async function GET() {
  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const tasks = await readTasks();

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: body.title,
    description: body.description || undefined,
    priority: body.priority || "medium",
    status: body.status || "todo",
    category: body.category || "Personal",
    dueDate: body.dueDate || undefined,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  return NextResponse.json(newTask, { status: 201 });
}
