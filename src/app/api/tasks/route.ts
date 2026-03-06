import { NextRequest, NextResponse } from "next/server";
import { readTasks, writeTasks } from "@/lib/tasks";
import { Task } from "@/lib/types";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const tasks = await readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth(request);
  if (authError) return authError;

  const body = await request.json();
  const tasks = await readTasks();

  const newTask: Task = {
    id: `task-${Date.now()}`,
    title: body.title,
    description: body.description || undefined,
    priority: body.priority || "medium",
    status: body.status || "todo",
    category: body.category || "Personal",
    requestedBy: body.requestedBy || "Libby",
    dueDate: body.dueDate || undefined,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  return NextResponse.json(newTask, { status: 201 });
}
