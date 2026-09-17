interface HeaderProps {
  total: number
  pending: number
  completed: number
}

export default function Header({ total, pending, completed }: HeaderProps) {
  return (
    <header className="border-b border-[var(--color-line)]">
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <p className="text-sm text-[var(--color-ink-soft)] mb-1">kLab Tech Upskill — Coding Challenge</p>
        <h1
          className="text-4xl text-[var(--color-ink)] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Task board
        </h1>
        <div className="flex gap-5 text-sm text-[var(--color-ink-soft)]">
          <span>{total} total</span>
          <span className="text-[var(--color-medium)]">{pending} pending</span>
          <span className="text-[var(--color-accent)]">{completed} completed</span>
        </div>
      </div>
    </header>
  )
}
