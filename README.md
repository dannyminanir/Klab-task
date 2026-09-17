# Task Management System

A full-stack task management app built for the kLab Tech Upskill Program coding challenge. Users can create, view, edit, delete, and filter tasks by status.

## Technologies used

**Backend**
- Java 21
- Spring Boot 4.1.1 (Spring Web, Spring Data JPA, Spring Validation)
- MySQL 8 (via `mysql-connector-j`)
- Lombok
- Maven

**Frontend**
- React 18 (Vite)
- Tailwind CSS 4

## Project structure

```
task-management-system/
├── backend/    Spring Boot REST API
└── frontend/   React + Tailwind client
```

## Prerequisites

- JDK 21+
- Maven 3.8+ (or use your IDE's bundled Maven)
- Node.js 18+ and npm
- MySQL 8 running locally (or accessible via network)

## 1. Database setup

Create the database (Hibernate will create the `tasks` table automatically on first run):

```sql
CREATE DATABASE taskmanagementsystem;
```

You don't need to create any tables manually — `spring.jpa.hibernate.ddl-auto=update` handles that.

## 2. Backend setup

```bash
cd backend
```

Open `src/main/resources/application.properties` and set your MySQL credentials:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/taskmanagementsystem?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Run it:

```bash
mvn spring-boot:run
```

The API starts on **http://localhost:8080**.

### Testing the API with Swagger

The backend includes `springdoc-openapi`, so once it's running you can test every endpoint straight from the browser — no Postman needed:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Raw OpenAPI spec**: http://localhost:8080/v3/api-docs

Open Swagger UI, expand an endpoint, click **Try it out**, fill in the request body (there are pre-filled examples), and **Execute**. This is the fastest way to confirm the backend works end to end before wiring up the frontend, and it's a handy thing to screenshot or link for your submission.

### API endpoints

| Method | Endpoint             | Purpose                                   |
|--------|-----------------------|--------------------------------------------|
| GET    | `/tasks`              | Get all tasks                              |
| GET    | `/tasks?status=PENDING` | Get tasks filtered by status (`PENDING` / `COMPLETED`) |
| GET    | `/tasks/{id}`         | Get one task                               |
| POST   | `/tasks`               | Create a task                              |
| PUT    | `/tasks/{id}`         | Update a task                              |
| DELETE | `/tasks/{id}`         | Delete a task                              |

**Example request body** (POST/PUT):

```json
{
  "title": "Set up CI pipeline",
  "description": "Add GitHub Actions for build and test",
  "status": "PENDING",
  "priority": "HIGH"
}
```

`status` accepts `PENDING` or `COMPLETED`. `priority` accepts `LOW`, `MEDIUM`, or `HIGH`. Both are optional on create and default to `PENDING` / `MEDIUM`.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs on **http://localhost:5173** and talks to the API at the URL set in `.env` (`VITE_API_URL`, defaults to `http://localhost:8080`).

## Technical decisions

- **Layered backend architecture**: controller → service (interface + impl) → repository, so business logic isn't mixed into the controller, and a `TaskRequest` DTO with Bean Validation (`@NotBlank`, `@Size`) keeps invalid data out of the entity layer.
- **Centralized error handling** via `@RestControllerAdvice` returns consistent JSON error bodies for 404s and validation failures instead of raw stack traces.
- **Filtering** is done server-side (`GET /tasks?status=PENDING`) rather than client-side, so it scales past small task lists.
- **`createdAt`/`updatedAt`** are set automatically with JPA lifecycle callbacks (`@PrePersist`/`@PreUpdate`) rather than trusted from client input.
- **CORS** is scoped to the local Vite dev origins (`localhost:5173`/`3000`) — update `CorsConfig` with your deployed frontend URL before going live.
- **Swagger UI (`springdoc-openapi`)** is wired in for interactive API testing and documentation at `/swagger-ui.html`, with `@Operation` annotations on each endpoint and example payloads on the request DTO.
- **Optimistic UI updates** on the frontend (status toggle and delete update state immediately, then roll back on API failure) for a snappier feel without a heavier state library.

## Deployment 

- **Backend**: AWS
- **Frontend**: Vercel
