import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Task, TaskRequest, TaskStatus } from '../types/task'
import * as taskApi from '../api/taskApi'

export interface TasksState {
  items: Task[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  filter: TaskStatus | ''
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
  filter: '',
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export const fetchTasks = createAsyncThunk<Task[], TaskStatus | '' | undefined, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (status, { rejectWithValue }) => {
    try {
      return await taskApi.fetchTasks(status)
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to load tasks'))
    }
  }
)

export const addTask = createAsyncThunk<Task, TaskRequest, { rejectValue: string }>(
  'tasks/addTask',
  async (payload, { rejectWithValue }) => {
    try {
      return await taskApi.createTask(payload)
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to create task'))
    }
  }
)

export const editTask = createAsyncThunk<
  Task,
  { id: number; payload: TaskRequest },
  { rejectValue: string }
>('tasks/editTask', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await taskApi.updateTask(id, payload)
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Failed to update task'))
  }
})

/** Flips PENDING <-> COMPLETED. Takes the full task so the UI can update optimistically. */
export const toggleTaskStatus = createAsyncThunk<Task, Task, { rejectValue: string }>(
  'tasks/toggleTaskStatus',
  async (task, { rejectWithValue }) => {
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    try {
      return await taskApi.updateTask(task.id, {
        title: task.title,
        description: task.description ?? undefined,
        priority: task.priority,
        status: nextStatus,
      })
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to update task'))
    }
  }
)

/** Takes the full task (not just the id) so a failed delete can restore it. */
export const removeTask = createAsyncThunk<number, Task, { rejectValue: string }>(
  'tasks/removeTask',
  async (task, { rejectWithValue }) => {
    try {
      await taskApi.deleteTask(task.id)
      return task.id
    } catch (err) {
      return rejectWithValue(errorMessage(err, 'Failed to delete task'))
    }
  }
)

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<TaskStatus | ''>) {
      state.filter = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // --- fetch ---
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load tasks'
      })

      // --- create ---
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to create task'
      })

      // --- update (form edit) ---
      .addCase(editTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(editTask.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to update task'
      })

      // --- toggle status: optimistic flip, reconcile on success, revert on failure ---
      .addCase(toggleTaskStatus.pending, (state, action) => {
        const original = action.meta.arg
        const idx = state.items.findIndex((t) => t.id === original.id)
        if (idx !== -1) {
          state.items[idx].status = original.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
        }
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((t) => t.id === action.payload.id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        const original = action.meta.arg
        const idx = state.items.findIndex((t) => t.id === original.id)
        if (idx !== -1) state.items[idx].status = original.status
        state.error = action.payload ?? 'Failed to update task'
      })

      // --- delete: optimistic removal, restore on failure ---
      .addCase(removeTask.pending, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.meta.arg.id)
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.items.push(action.meta.arg)
        state.error = action.payload ?? 'Failed to delete task'
      })
  },
})

export const { setFilter, clearError } = tasksSlice.actions
export default tasksSlice.reducer
