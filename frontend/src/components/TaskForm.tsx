import { useEffect, useState, type FormEvent } from 'react'
import type { Priority, Task, TaskRequest, TaskStatus } from '../types/task'

interface TaskFormProps {
  open: boolean
  task: Task | null
  onClose: () => void
  onSubmit: (values: TaskRequest) => Promise<void>
}

interface FormValues {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
}

const EMPTY: FormValues = { title: '', description: '', status: 'PENDING', priority: 'MEDIUM' }

export default function TaskForm({ open, task, onClose, onSubmit }: TaskFormProps) {
  const [form, setForm] = useState<FormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(
        task
          ? {
              title: task.title,
              description: task.description ?? '',
              status: task.status,
              priority: task.priority,
            }
          : EMPTY
      )
      setErrors({})
    }
  }, [open, task])

  if (!open) return null

  function update<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormValues, string>> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    else if (form.title.length > 150) next.title = 'Title must be at most 150 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(form)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/30" />

      <div className="relative w-full max-w-md h-full bg-[var(--color-surface)] shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-line)]">
          <h2 className="text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            {task ? 'Edit task' : 'New task'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="p-1.5 rounded-md text-[var(--color-ink-soft)] hover:bg-[var(--color-line)]"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="e.g. Set up the database schema"
            />
            {errors.title && <p className="text-xs text-[var(--color-high)] mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
              placeholder="Optional details about this task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value as Priority)}
                className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => update('status', e.target.value as TaskStatus)}
                className="w-full rounded-md border border-[var(--color-line)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="mt-auto pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm rounded-md border border-[var(--color-line)] hover:bg-[var(--color-line)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 text-sm rounded-md bg-[var(--color-accent)] text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Saving…' : task ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
