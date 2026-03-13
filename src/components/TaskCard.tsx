"use client";

import { useState, useRef, useEffect } from "react";
import {
  Task,
  Category,
  Priority,
  RequestedBy,
  CATEGORIES,
  PRIORITIES,
  REQUESTED_BY_OPTIONS,
  CATEGORY_COLORS,
  PRIORITY_BORDER,
  PRIORITY_LABELS,
  REQUESTED_BY_COLORS,
  Status,
  STATUSES,
} from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

function InlineText({
  value,
  onSave,
  multiline,
  placeholder,
  className,
}: {
  value: string;
  onSave: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) onSave(trimmed);
  };

  if (!editing) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setDraft(value);
          setEditing(true);
        }}
        className={`cursor-text rounded px-1 -mx-1 hover:bg-warm-100 transition-colors ${className ?? ""}`}
        title="Click to edit"
      >
        {value || <span className="italic text-warm-300">{placeholder ?? "Add..."}</span>}
      </span>
    );
  }

  const shared = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: commit,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commit();
      }
      if (e.key === "Escape") {
        setDraft(value);
        setEditing(false);
      }
    },
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    className: `w-full rounded border border-sage-300 bg-white px-1.5 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-sage-400 ${className ?? ""}`,
    placeholder,
  };

  if (multiline) {
    return <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} rows={3} {...shared} />;
  }
  return <input ref={ref as React.RefObject<HTMLInputElement>} type="text" {...shared} />;
}

function InlineSelect<T extends string>({
  value,
  options,
  labels,
  onSave,
  className,
}: {
  value: T;
  options: readonly T[];
  labels?: Record<T, string>;
  onSave: (v: T) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => {
        e.stopPropagation();
        onSave(e.target.value as T);
      }}
      onClick={(e) => e.stopPropagation()}
      className={`rounded border border-warm-200 bg-white px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-sage-400 cursor-pointer ${className ?? ""}`}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {labels ? labels[o] : o}
        </option>
      ))}
    </select>
  );
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
          {expanded ? (
            <InlineText
              value={task.title}
              onSave={(v) => v && onUpdate(task.id, { title: v })}
              className="text-sm font-medium leading-snug text-foreground"
            />
          ) : (
            <h3 className="text-sm font-medium leading-snug text-foreground">
              {task.title}
            </h3>
          )}
          {expanded ? (
            <InlineSelect
              value={task.category}
              options={CATEGORIES}
              onSave={(v) => onUpdate(task.id, { category: v })}
              className={CATEGORY_COLORS[task.category]}
            />
          ) : (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}
            >
              {task.category}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-warm-400">
          {expanded ? (
            <InlineSelect
              value={task.priority}
              options={PRIORITIES}
              labels={PRIORITY_LABELS}
              onSave={(v) => onUpdate(task.id, { priority: v })}
            />
          ) : (
            <span>{PRIORITY_LABELS[task.priority]}</span>
          )}
          {expanded ? (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                from
                <InlineSelect
                  value={task.requestedBy}
                  options={REQUESTED_BY_OPTIONS}
                  onSave={(v) => onUpdate(task.id, { requestedBy: v })}
                  className={REQUESTED_BY_COLORS[task.requestedBy]}
                />
              </span>
            </>
          ) : (
            task.requestedBy && (
              <>
                <span>·</span>
                <span className={REQUESTED_BY_COLORS[task.requestedBy]}>
                  from {task.requestedBy}
                </span>
              </>
            )
          )}
          {expanded ? (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                Due
                <input
                  type="date"
                  value={task.dueDate ?? ""}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdate(task.id, { dueDate: e.target.value || undefined });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border border-warm-200 bg-white px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-sage-400 cursor-pointer"
                />
              </span>
            </>
          ) : (
            task.dueDate && (
              <>
                <span>·</span>
                <span>Due {formatDate(task.dueDate)}</span>
              </>
            )
          )}
          <span>·</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-3 border-t border-warm-100 pt-3">
          {/* Description - always show when expanded so it can be added */}
          <div className="mb-3">
            <InlineText
              value={task.description ?? ""}
              onSave={(v) => onUpdate(task.id, { description: v || undefined })}
              multiline
              placeholder="Add description..."
              className="text-sm leading-relaxed text-warm-500"
            />
          </div>

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
