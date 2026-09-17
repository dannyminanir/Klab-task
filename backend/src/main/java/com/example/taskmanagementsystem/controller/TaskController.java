package com.example.taskmanagementsystem.controller;

import com.example.taskmanagementsystem.dto.TaskRequest;
import com.example.taskmanagementsystem.model.Task;
import com.example.taskmanagementsystem.model.TaskStatus;
import com.example.taskmanagementsystem.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Create, view, update, delete and filter tasks")
public class TaskController {

    private final TaskService taskService;

    @Operation(summary = "Get all tasks", description = "Returns every task, or only tasks matching the given status when ?status= is provided.")
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @Parameter(description = "Filter by status: PENDING or COMPLETED")
            @RequestParam(required = false) TaskStatus status) {
        return ResponseEntity.ok(taskService.getAllTasks(status));
    }

    @Operation(summary = "Get one task by id")
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @Operation(summary = "Create a task")
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request) {
        Task created = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update an existing task")
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,
                                            @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.updateTask(id, request));
    }

    @Operation(summary = "Delete a task")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
