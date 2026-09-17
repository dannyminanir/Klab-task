import type { Priority, Task } from '../types/task'

interface TaskRowProps {
  task: Task
  onToggleStatus: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

const PRIORITY_STYLES: Record<Priority, { text: string; bar: string; label: string }> = {
  HIGH: { text: 'text-[var(--color-high)]', bar: 'bg-[var(--color-high)]', label: 'High' },
  MEDIUM: { text: 'text-[var(--color-medium)]', bar: 'bg-[var(--color-medium)]', label: 'Medium' },
  LOW: { text: 'text-[var(--color-low)]', bar: 'bg-[var(--color-low)]', label: 'Low' },
}

function formatDate(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TaskRow({ task, onToggleStatus, onEdit, onDelete }: TaskRowProps) {
  const priority = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.MEDIUM
  const isCompleted = task.status === 'COMPLETED'

  return (
    <div className="group flex items-start gap-4 py-4 border-b border-[var(--color-line)] last:border-b-0">
      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${priority.bar}`} aria-hidden="true" />

      <button
        onClick={() => onToggleStatus(task)}
        aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        className={`mt-0.5 w-5 h-5 shrink-0 rounded-full border flex items-center justify-center transition-colors ${
          isCompleted
            ? 'bg-[var(--color-accent)] border-[var(--color-accent)]'
            : 'border-[var(--color-ink-soft)] hover:border-[var(--color-accent)]'
        }`}
      >
        {isCompleted && (
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 fill-white">
            <path d="M4.6 8.6 2 6l-.9.9L4.6 10.4 11 4 10.1 3z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h3
            className={`text-[15px] font-medium ${
              isCompleted ? 'text-[var(--color-ink-soft)] line-through' : 'text-[var(--color-ink)]'
            }`}
          >
            {task.title}
          </h3>
          <span className={`text-xs ${priority.text}`}>{priority.label}</span>
        </div>
        {task.description && (
          <p className="text-sm text-[var(--color-ink-soft)] mt-0.5 line-clamp-2">{task.description}</p>
        )}
        <p className="text-xs text-[var(--color-ink-soft)] mt-1.5">Created {formatDate(task.createdAt)}</p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="p-1.5 rounded-md text-[var(--color-ink-soft)] hover:bg-[var(--color-line)] hover:text-[var(--color-ink)]"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
            <path d="M11.3 1.3a1 1 0 0 1 1.4 0l2 2a1 1 0 0 1 0 1.4L6 13.4 2 14l.6-4L11.3 1.3Z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="p-1.5 rounded-md text-[var(--color-ink-soft)] hover:bg-[var(--color-high-soft)] hover:text-[var(--color-high)]"
        >
          <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
            <path d="M6 2h4l.5 1H14v1.5H2V3h3.5L6 2Zm-2 4h8l-.6 8.1a1 1 0 0 1-1 .9H5.6a1 1 0 0 1-1-.9L4 6Z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
