# Finwise Spring Boot backend

Requirements:
- JDK 17+
- Maven 3.9+
- MySQL running locally with database user/password: `user`/`password`

Configure (optional): edit `src/main/resources/application.properties` for custom DB creds, CORS, and JWT secret.

Run:
1. Start MySQL and ensure user `user` with password `password` exists and has privileges.
2. From `backend/` run:
   - `mvn spring-boot:run`

API:
- POST `/api/auth/register` { firstName, lastName, email, phone, password }
- POST `/api/auth/login` { email, password } -> { token, user }
- GET `/api/auth/me` (Authorization: Bearer <token>)
- GET `/api/items`
- GET `/api/items/{id}`
- POST `/api/items` (auth)
- PUT `/api/items/{id}` (auth, owner/admin)
- DELETE `/api/items/{id}` (auth, owner/admin)
