"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, Category, Priority, Status, RequestedBy, STATUSES } from "@/lib/types";
import Header from "./Header";
import FilterBar from "./FilterBar";
import TaskColumn from "./TaskColumn";
import AddTaskModal from "./AddTaskModal";

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [filterRequestedBy, setFilterRequestedBy] = useState<RequestedBy | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleAdd = async (taskData: {
    title: string;
    description?: string;
    priority: Priority;
    status: Status;
    category: Category;
    requestedBy: RequestedBy;
    dueDate?: string;
  }) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskData),
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setShowAddModal(false);
    }
  };

  const handleDrop = (taskId: string, newStatus: Status) => {
    handleUpdate(taskId, { status: newStatus });
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterRequestedBy !== "all" && t.requestedBy !== filterRequestedBy) return false;
    return true;
  });

  const tasksByStatus = (status: Status) =>
    filteredTasks.filter((t) => t.status === status);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-warm-400">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header onAddTask={() => setShowAddModal(true)} />
      <FilterBar
        selectedCategory={filterCategory}
        selectedPriority={filterPriority}
        selectedRequestedBy={filterRequestedBy}
        onCategoryChange={setFilterCategory}
        onPriorityChange={setFilterPriority}
        onRequestedByChange={setFilterRequestedBy}
      />

      {/* Columns */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STATUSES.map((s) => (
            <TaskColumn
              key={s.key}
              status={s.key}
              label={s.label}
              tasks={tasksByStatus(s.key)}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      <AddTaskModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
