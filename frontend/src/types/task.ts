export type TaskStatus = 'PENDING' | 'COMPLETED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  createdAt: string
  updatedAt: string
}

/** Shape sent to POST /tasks and PUT /tasks/:id */
export interface TaskRequest {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
}
