import { promises as fs } from "fs";
import path from "path";
import { Task } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "tasks.json");

export async function readTasks(): Promise<Task[]> {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data) as Task[];
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}
