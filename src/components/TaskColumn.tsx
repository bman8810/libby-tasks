"use client";

import { useState } from "react";
import { Task, Status } from "@/lib/types";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: Status;
  label: string;
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onDrop: (taskId: string, newStatus: Status) => void;
}

const STATUS_ICONS: Record<Status, string> = {
  todo: "○",
  "in-progress": "◑",
  done: "●",
};

const STATUS_COLORS: Record<Status, string> = {
  todo: "text-warm-400",
  "in-progress": "text-sage-500",
  done: "text-sage-700",
};

export default function TaskColumn({
  status,
  label,
  tasks,
  onUpdate,
  onDelete,
  onDrop,
}: TaskColumnProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`flex min-h-[200px] flex-col rounded-xl bg-warm-50 p-3 ${
        dragOver ? "column-drop-active" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) onDrop(taskId, status);
      }}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={`text-sm ${STATUS_COLORS[status]}`}>
          {STATUS_ICONS[status]}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{label}</h2>
        <span className="ml-auto rounded-full bg-warm-200 px-2 py-0.5 text-xs font-medium text-warm-500">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-sm text-warm-300">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
