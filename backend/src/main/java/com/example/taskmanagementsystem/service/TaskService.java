package com.example.taskmanagementsystem.service;

import com.example.taskmanagementsystem.dto.TaskRequest;
import com.example.taskmanagementsystem.model.Task;
import com.example.taskmanagementsystem.model.TaskStatus;

import java.util.List;

public interface TaskService {

    List<Task> getAllTasks(TaskStatus status);

    Task getTaskById(Long id);

    Task createTask(TaskRequest request);

    Task updateTask(Long id, TaskRequest request);

    void deleteTask(Long id);
}
