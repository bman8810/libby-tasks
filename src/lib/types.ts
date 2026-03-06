export type Priority = "high" | "medium" | "low";
export type Status = "todo" | "in-progress" | "done";
export type Category = "Liora" | "Family" | "Personal" | "Lev";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  category: Category;
  dueDate?: string;
  createdAt: string;
}

export const CATEGORIES: Category[] = ["Liora", "Family", "Personal", "Lev"];
export const PRIORITIES: Priority[] = ["high", "medium", "low"];
export const STATUSES: { key: Status; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Liora: "bg-teal-100 text-teal-800",
  Family: "bg-purple-100 text-purple-800",
  Personal: "bg-sky-100 text-sky-800",
  Lev: "bg-orange-100 text-orange-800",
};

export const PRIORITY_BORDER: Record<Priority, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-400",
  low: "border-l-emerald-400",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
