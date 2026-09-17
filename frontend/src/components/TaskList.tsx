import TaskRow from './TaskRow'
import type { Task, TaskStatus } from '../types/task'

interface TaskListProps {
  tasks: Task[]
  loading: boolean
  error: string | null
  filter: TaskStatus | ''
  onToggleStatus: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export default function TaskList({
  tasks,
  loading,
  error,
  filter,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return <p className="text-sm text-[var(--color-ink-soft)] py-10 text-center">Loading tasks…</p>
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-[var(--color-high)]">{error}</p>
        <p className="text-xs text-[var(--color-ink-soft)] mt-1">
          Check that the backend is running on the configured API URL.
        </p>
      </div>
    )
  }

  if (tasks.length === 0) {
    const emptyMessage =
      filter === 'PENDING'
        ? 'No pending tasks. Everything is done, or nothing has been added yet.'
        : filter === 'COMPLETED'
        ? 'No completed tasks yet.'
        : 'No tasks yet. Add your first task to get started.'
    return <p className="text-sm text-[var(--color-ink-soft)] py-10 text-center">{emptyMessage}</p>
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
