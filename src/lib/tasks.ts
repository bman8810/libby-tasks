import { promises as fs } from "fs";
import path from "path";
import { Task } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "tasks.json");

function useKV(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// --- JSON file storage (fallback for local dev) ---

async function readTasksFromFile(): Promise<Task[]> {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data) as Task[];
}

async function writeTasksToFile(tasks: Task[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}

// --- Vercel KV storage ---

const KV_KEY = "libby:tasks";

async function getKV() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

async function readTasksFromKV(): Promise<Task[]> {
  const store = await getKV();
  const tasks = await store.get<Task[]>(KV_KEY);
  return tasks || [];
}

async function writeTasksToKV(tasks: Task[]): Promise<void> {
  const store = await getKV();
  await store.set(KV_KEY, tasks);
}

// --- Public API ---

export async function readTasks(): Promise<Task[]> {
  if (useKV()) {
    return readTasksFromKV();
  }
  return readTasksFromFile();
}

export async function writeTasks(tasks: Task[]): Promise<void> {
  if (useKV()) {
    return writeTasksToKV(tasks);
  }
  return writeTasksToFile(tasks);
}
