# BeautyBook - Online Beautician Booking System

A full-stack web application for booking beautician services online, built with **Spring Boot** and **React**.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-green)
![React](https://img.shields.io/badge/React-19-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## Features

### Authentication & Security
- JWT-based authentication with role-based access control
- Secure password hashing with BCrypt
- Route guards on frontend (ProtectedRoute)
- Stateless session management

### Client Features
- Browse and search beauticians with filters
- View beautician profiles, services, and reviews
- Book appointments with date/time selection
- Cancel bookings with reason
- Rate and review beauticians after service
- Favorites/Wishlist management
- Booking history with status tracking
- Dashboard with booking statistics

### Beautician Features
- Manage services (add/delete with pricing & duration)
- Manage availability slots
- View and manage booking requests (approve/reject/complete)
- View client reviews and ratings
- Dashboard with stats and upcoming bookings

### Admin Features
- Manage all users (view/deactivate)
- Manage beauticians and bookings
- Manage reviews (view/delete)
- Admin dashboard with system-wide statistics

### UX Enhancements
- Dark mode toggle
- Responsive design (mobile-friendly)
- Toast notifications (react-hot-toast)
- Confirmation modals (no browser dialogs)
- Rating summary with star breakdown
- Search & filter across entities

### DevOps & API
- Swagger/OpenAPI documentation at `/swagger-ui/index.html`
- Docker & Docker Compose support
- Email notifications for bookings (async)
- Unit & integration tests (JUnit 5 + Mockito)

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Backend    | Java 17, Spring Boot 3.5.0, Spring Security   |
| Frontend   | React 19, Vite 7, React Router 7              |
| Database   | MySQL 8.0                                     |
| Auth       | JWT (jjwt 0.12.6)                             |
| API Docs   | SpringDoc OpenAPI 2.8.6                        |
| Email      | Spring Boot Mail (Gmail SMTP)                  |
| Testing    | JUnit 5, Mockito, MockMvc                      |
| DevOps     | Docker, Docker Compose                         |

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌──────────┐
│   React App  │────▶│  Spring Boot API │────▶│  MySQL   │
│  (Vite SPA)  │     │  (REST + JWT)    │     │  8.0     │
└──────────────┘     └──────────────────┘     └──────────┘
     :5173                 :8080                 :3306
```

## ER Diagram

```
┌─────────────┐       ┌──────────────────┐       ┌────────────────┐
│    users     │       │   beauticians    │       │   services     │
├─────────────┤       ├──────────────────┤       ├────────────────┤
│ id (PK)     │       │ id (PK)          │       │ id (PK)        │
│ username    │──1:1──│ user_id (FK)     │──1:N──│ beautician_id  │
│ email       │       │ salon_name       │       │ service_name   │
│ password    │       │ specialization   │       │ description    │
│ mobile      │       │ experience_years │       │ price          │
│ country     │       │ description      │       │ duration_mins  │
│ role        │       │ rating_average   │       └────────────────┘
│ active      │       └──────────────────┘
│ created_at  │              │
└─────────────┘              │ 1:N
       │                     │
       │ 1:N          ┌──────────────┐       ┌──────────────────┐
       │              │   bookings   │       │ availability_slots│
       └──────────────│ id (PK)      │       ├──────────────────┤
                      │ client_id(FK)│       │ id (PK)          │
                      │ beautician_id│       │ beautician_id(FK)│
                      │ service_id   │       │ date             │
                      │ booking_date │       │ start_time       │
                      │ booking_time │       │ end_time         │
                      │ status       │       │ booked           │
                      │ notes        │       └──────────────────┘
                      │ client_phone │
                      │ cancel_reason│       ┌──────────────────┐
                      │ created_at   │       │    favorites     │
                      └──────────────┘       ├──────────────────┤
                                             │ id (PK)          │
       ┌──────────────┐                      │ user_id (FK)     │
       │   reviews    │                      │ beautician_id(FK)│
       ├──────────────┤                      └──────────────────┘
       │ id (PK)      │
       │ client_id(FK)│
       │ beautician_id│
       │ rating (1-5) │
       │ comment      │
       │ created_at   │
       └──────────────┘
```

### Relationships
- **User → Beautician**: One-to-One (beautician profile)
- **Beautician → Services**: One-to-Many
- **Beautician → Availability Slots**: One-to-Many
- **User → Bookings**: One-to-Many (as client)
- **Beautician → Bookings**: One-to-Many
- **User → Reviews**: One-to-Many (as client)
- **Beautician → Reviews**: One-to-Many
- **User → Favorites**: Many-to-Many (through favorites table)

## Project Structure

```
OnlineBeauticianBooking/
├── backend/
│   ├── src/main/java/com/beautician/bookingsystem/
│   │   ├── config/          # Security, CORS, Swagger config
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── exception/       # Custom exceptions & global handler
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT filter & utility
│   │   └── service/         # Business logic layer
│   ├── src/test/            # Unit & integration tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, ConfirmModal, etc.)
│   │   ├── layouts/         # MainLayout
│   │   ├── pages/           # Page components (client, beautician, admin, public)
│   │   └── services/        # API service modules
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

```bash
cd backend

# Configure database in src/main/resources/application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/beautician_booking_db
# spring.datasource.username=root
# spring.datasource.password=YOUR_PASSWORD

# Build and run
mvn spring-boot:run
```

Backend runs at `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Docker Setup

```bash
# Start all services
docker-compose up --build

# Access:
# Frontend → http://localhost
# Backend  → http://localhost:8080
# Swagger  → http://localhost:8080/swagger-ui/index.html
```

## API Documentation

Swagger UI available at: `http://localhost:8080/swagger-ui/index.html`

### Key Endpoints

| Method | Endpoint                        | Auth     | Description                |
|--------|---------------------------------|----------|----------------------------|
| POST   | `/api/auth/register`            | Public   | Register new user          |
| POST   | `/api/auth/login`               | Public   | Login & get JWT token      |
| GET    | `/api/beauticians`              | Public   | List all beauticians       |
| GET    | `/api/beauticians/{id}`         | Public   | Get beautician details     |
| GET    | `/api/services/beautician/{id}` | Public   | Get beautician's services  |
| POST   | `/api/bookings/{clientId}`      | CLIENT   | Create a booking           |
| PUT    | `/api/bookings/{id}/cancel`     | AUTH     | Cancel a booking           |
| PUT    | `/api/bookings/{id}/approve`    | AUTH     | Approve a booking          |
| POST   | `/api/reviews`                  | CLIENT   | Submit a review            |
| GET    | `/api/admin/users`              | ADMIN    | Get all users              |

## Testing

```bash
cd backend
mvn test
```

**Test Coverage:**
- `UserServiceTest` (8 tests) — registration, login, validation
- `BookingServiceTest` (15 tests) — CRUD, conflicts, status transitions
- `AuthControllerTest` (6 tests) — endpoint integration tests

## Environment Variables

| Variable        | Description               | Default                  |
|-----------------|---------------------------|--------------------------|
| `MAIL_USERNAME` | Gmail address for emails  | your-email@gmail.com     |
| `MAIL_PASSWORD` | Gmail app password        | your-app-password        |

## Roles

| Role        | Capabilities                                           |
|-------------|--------------------------------------------------------|
| CLIENT      | Book, cancel, review, favorites, view history          |
| BEAUTICIAN  | Manage services/availability, approve/reject bookings  |
| ADMIN       | Manage users, beauticians, bookings, reviews           |

## License

This project is for educational/hackathon purposes.
