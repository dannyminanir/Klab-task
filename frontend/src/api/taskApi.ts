import type { Task, TaskRequest, TaskStatus } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

interface ApiErrorBody {
  message?: string
  error?: string
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const body = data as ApiErrorBody | null
    throw new Error(body?.message || body?.error || `Request failed (${res.status})`)
  }
  return data as T
}

export async function fetchTasks(status?: TaskStatus | ''): Promise<Task[]> {
  const query = status ? `?status=${status}` : ''
  const res = await fetch(`${API_URL}/tasks${query}`)
  return handleResponse<Task[]>(res)
}

export async function fetchTask(id: number): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`)
  return handleResponse<Task>(res)
}

export async function createTask(payload: TaskRequest): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Task>(res)
}

export async function updateTask(id: number, payload: TaskRequest): Promise<Task> {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse<Task>(res)
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
  return handleResponse<void>(res)
}
