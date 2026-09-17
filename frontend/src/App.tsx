import { useEffect, useState } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { addTask, editTask, fetchTasks, removeTask, setFilter, toggleTaskStatus } from './store/tasksSlice'
import type { Task, TaskRequest } from './types/task'

export default function App() {
  const dispatch = useAppDispatch()
  const { items: tasks, status, error, filter } = useAppSelector((state) => state.tasks)

  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    dispatch(fetchTasks(filter))
  }, [dispatch, filter])

  function openNewTaskForm() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  async function handleFormSubmit(values: TaskRequest) {
    if (editingTask) {
      await dispatch(editTask({ id: editingTask.id, payload: values })).unwrap()
    } else {
      await dispatch(addTask(values)).unwrap()
    }
    setFormOpen(false)
  }

  function handleToggleStatus(task: Task) {
    dispatch(toggleTaskStatus(task))
  }

  function handleDelete(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This can't be undone.`)) return
    dispatch(removeTask(task))
  }

  const total = tasks.length
  const pending = tasks.filter((t) => t.status === 'PENDING').length
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length

  return (
    <div className="min-h-screen">
      <Header total={total} pending={pending} completed={completed} />

      <main className="max-w-3xl mx-auto px-6 py-8">
        <FilterBar
          activeFilter={filter}
          onFilterChange={(f) => dispatch(setFilter(f))}
          onNewTask={openNewTaskForm}
        />
        <TaskList
          tasks={tasks}
          loading={status === 'loading'}
          error={error}
          filter={filter}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />
      </main>

      <TaskForm
        open={formOpen}
        task={editingTask}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}
