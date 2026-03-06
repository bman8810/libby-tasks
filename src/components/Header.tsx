"use client";

interface HeaderProps {
  onAddTask: () => void;
}

export default function Header({ onAddTask }: HeaderProps) {
  return (
    <header className="bg-warm-50 border-b border-warm-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="leaf">
            🌿
          </span>
          <h1 className="text-xl font-semibold text-sage-700 sm:text-2xl">
            Libby&apos;s Board
          </h1>
          <span className="ml-2 hidden text-sm text-warm-400 sm:inline">
            managed by Reedy
          </span>
        </div>
        <button
          onClick={onAddTask}
          className="rounded-lg bg-sage-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-600"
        >
          + New Task
        </button>
      </div>
    </header>
  );
}
