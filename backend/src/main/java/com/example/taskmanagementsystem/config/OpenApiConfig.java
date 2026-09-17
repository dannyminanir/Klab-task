package com.example.taskmanagementsystem.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI taskManagementOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Task Management System API")
                        .description("REST API for managing tasks — create, view, update, delete, and filter by status.")
                        .version("v1.0")
                        .contact(new Contact().name("kLab Tech Upskill Program")));
    }
}
