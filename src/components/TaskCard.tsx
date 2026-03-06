"use client";

import { useState } from "react";
import { Task, CATEGORY_COLORS, PRIORITY_BORDER, PRIORITY_LABELS, REQUESTED_BY_COLORS, Status, STATUSES } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (newStatus: Status) => {
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div
      className={`task-card cursor-pointer rounded-lg border-l-4 bg-white p-3 shadow-sm ${PRIORITY_BORDER[task.priority]}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      <div onClick={() => setExpanded(!expanded)}>
        {/* Top row: title + category pill */}
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium leading-snug text-foreground">
            {task.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}
          >
            {task.category}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-warm-400">
          <span>{PRIORITY_LABELS[task.priority]}</span>
          {task.requestedBy && (
            <>
              <span>·</span>
              <span className={REQUESTED_BY_COLORS[task.requestedBy]}>
                from {task.requestedBy}
              </span>
            </>
          )}
          {task.dueDate && (
            <>
              <span>·</span>
              <span>Due {formatDate(task.dueDate)}</span>
            </>
          )}
          <span>·</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 border-t border-warm-100 pt-3">
          {task.description && (
            <p className="mb-3 text-sm leading-relaxed text-warm-500">
              {task.description}
            </p>
          )}

          {/* Move to column */}
          <div className="mb-3 flex flex-wrap gap-1.5">
            {STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(s.key);
                }}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  task.status === s.key
                    ? "bg-sage-500 text-white"
                    : "bg-warm-100 text-warm-500 hover:bg-warm-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              className="text-xs text-warm-400 hover:text-red-500"
            >
              Delete task
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500">Are you sure?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                className="rounded bg-red-500 px-2 py-0.5 text-xs text-white hover:bg-red-600"
              >
                Yes, delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(false);
                }}
                className="text-xs text-warm-400 hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
