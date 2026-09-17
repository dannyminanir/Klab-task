package com.example.taskmanagementsystem.repository;

import com.example.taskmanagementsystem.model.Task;
import com.example.taskmanagementsystem.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByStatus(TaskStatus status);

    List<Task> findByTitleContainingIgnoreCase(String keyword);
}
