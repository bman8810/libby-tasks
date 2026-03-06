"use client";

import { Category, Priority, RequestedBy, CATEGORIES, PRIORITIES, PRIORITY_LABELS, REQUESTED_BY_OPTIONS } from "@/lib/types";

interface FilterBarProps {
  selectedCategory: Category | "all";
  selectedPriority: Priority | "all";
  selectedRequestedBy: RequestedBy | "all";
  onCategoryChange: (cat: Category | "all") => void;
  onPriorityChange: (pri: Priority | "all") => void;
  onRequestedByChange: (rb: RequestedBy | "all") => void;
}

export default function FilterBar({
  selectedCategory,
  selectedPriority,
  selectedRequestedBy,
  onCategoryChange,
  onPriorityChange,
  onRequestedByChange,
}: FilterBarProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
      <span className="text-sm font-medium text-warm-500">Filter:</span>

      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as Category | "all")}
        className="rounded-md border border-warm-200 bg-warm-50 px-3 py-1.5 text-sm text-foreground focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={selectedPriority}
        onChange={(e) => onPriorityChange(e.target.value as Priority | "all")}
        className="rounded-md border border-warm-200 bg-warm-50 px-3 py-1.5 text-sm text-foreground focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
      >
        <option value="all">All Priorities</option>
        {PRIORITIES.map((pri) => (
          <option key={pri} value={pri}>
            {PRIORITY_LABELS[pri]}
          </option>
        ))}
      </select>

      <select
        value={selectedRequestedBy}
        onChange={(e) => onRequestedByChange(e.target.value as RequestedBy | "all")}
        className="rounded-md border border-warm-200 bg-warm-50 px-3 py-1.5 text-sm text-foreground focus:border-sage-500 focus:ring-1 focus:ring-sage-500 focus:outline-none"
      >
        <option value="all">All Requesters</option>
        {REQUESTED_BY_OPTIONS.map((rb) => (
          <option key={rb} value={rb}>
            {rb}
          </option>
        ))}
      </select>
    </div>
  );
}
