# Finwise Spring Boot backend

Spring Boot 3.3 · Spring Security (JWT) · Spring Data JPA · MySQL (or embedded H2)

## Requirements
- JDK 17 or newer (tested on JDK 26)
- Maven is **not** required – use the bundled wrapper `mvnw.cmd`
- MySQL 8 (optional – use the `h2` profile to run without it)

## Run

| Database | Command (from `backend/`) |
|---|---|
| MySQL | `set DB_PASSWORD=your_mysql_password` then `mvnw.cmd spring-boot:run` (or `run-mysql.bat`) |
| Embedded H2 | `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=h2` (or `run-h2.bat`) |

In **Eclipse**: run `FinwiseBackendApplication` as a Java application. To use H2, add
`--spring.profiles.active=h2` to the program arguments; for MySQL, set `DB_PASSWORD` in the
run configuration's Environment tab.

Build a jar: `mvnw.cmd -DskipTests package` → `java -jar target/finwise-backend-0.0.1-SNAPSHOT.jar`

### Configuration (environment variables)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8080` | HTTP port |
| `DB_URL` | `jdbc:mysql://localhost:3306/finwise_db?...` | JDBC URL |
| `DB_USERNAME` / `DB_PASSWORD` | `root` / `password` | MySQL credentials |
| `JWT_SECRET` | dev secret | HMAC key for tokens (32+ bytes) – **change in production** |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Allowed browser origins |
| `UPLOAD_DIR` | `uploads` | Where uploaded documents are stored |

Tables are created automatically and demo data is seeded on first start.

## Demo accounts
- Admin: `admin@finwise.com` / `admin123`
- User: `john.doe@example.com` / `user123`

## API overview
All endpoints are under `/api`. Send `Authorization: Bearer <token>` for protected routes.
Errors are JSON: `{ "status": 400, "message": "..." }`.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET/PUT /auth/me`, `PUT /auth/me/password` |
| Profile | `GET /user-profile/my-profile`, `PUT /user-profile`, `GET /user-profile` (admin) |
| Goals | `GET /financial-plans/my-plans`, `POST /financial-plans`, `PUT/DELETE /financial-plans/{id}`, `GET /financial-plans` (admin) |
| Appointments | `GET /appointments/my-appointments`, `POST /appointments`, `PUT /appointments/{id}/cancel`, `DELETE /appointments/{id}`, `GET /appointments` (admin), `PUT /appointments/{id}/status?status=&advisorName=` (admin) |
| Messages | `GET /messages/my-messages`, `GET /messages/sent-messages`, `GET /messages/unread-count`, `POST /messages`, `PUT /messages/{id}/read`, `DELETE /messages/{id}`, `GET /messages` (admin) |
| Documents | `GET /documents/my-documents`, `POST /documents` (multipart `file`), `GET /documents/{id}/download`, `DELETE /documents/{id}`, `GET /documents` (admin), `PUT /documents/{id}/status?status=&reviewNotes=` (admin) |
| Orders | `POST /orders/checkout`, `GET /orders/my-orders`, `GET /orders/{id}`, `GET /orders` (admin), `PUT /orders/{id}/status` (admin) |
| Admin | `GET /admin/dashboard`, `GET/POST /admin/users`, `GET/PUT/DELETE /admin/users/{id}`, `PUT /admin/users/{id}/role?role=` |
| Catalogue (public) | `GET /courses`, `GET /categories`, `GET /investment-products`, `GET /items`, `GET /health` |

Payments are simulated: checkout records the order as paid without charging anything.
