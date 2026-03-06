"use client";

import { useState, useEffect, useRef } from "react";
import {
  Category,
  Priority,
  Status,
  CATEGORIES,
  PRIORITIES,
  PRIORITY_LABELS,
  STATUSES,
} from "@/lib/types";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    category: Category;
    dueDate?: string;
  }) => void;
}

export default function AddTaskModal({ open, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("todo");
  const [category, setCategory] = useState<Category>("Personal");
  const [dueDate, setDueDate] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setCategory("Personal");
      setDueDate("");
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      category,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          New Task
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={titleRef}
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
            required
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-warm-500">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-warm-500">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-warm-500">
                Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-warm-500">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2 text-sm focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-warm-500 hover:bg-warm-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-sage-500 px-4 py-2 text-sm font-medium text-white hover:bg-sage-600"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
