package com.example.taskmanagementsystem.dto;

import com.example.taskmanagementsystem.model.Priority;
import com.example.taskmanagementsystem.model.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {

    @Schema(example = "Set up CI pipeline")
    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be at most 150 characters")
    private String title;

    @Schema(example = "Add GitHub Actions for build and test")
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @Schema(example = "PENDING")
    private TaskStatus status;

    @Schema(example = "HIGH")
    private Priority priority;
}
