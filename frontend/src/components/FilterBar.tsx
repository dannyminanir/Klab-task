import type { TaskStatus } from '../types/task'

interface FilterBarProps {
  activeFilter: TaskStatus | ''
  onFilterChange: (filter: TaskStatus | '') => void
  onNewTask: () => void
}

const FILTERS: { value: TaskStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
]

export default function FilterBar({ activeFilter, onFilterChange, onNewTask }: FilterBarProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex gap-1">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value
          return (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`px-3.5 py-1.5 text-sm rounded-full transition-colors ${
                isActive
                  ? 'bg-[var(--color-ink)] text-white'
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-line)]'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      <button
        onClick={onNewTask}
        className="px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
      >
        New task
      </button>
    </div>
  )
}
