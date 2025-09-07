# LabCourse1.Backend (Simple .NET 8 Web API)

A minimal, **secure**, and **well-structured** backend that fulfills the Lab Course 1 - 2025 Backend requirements:
- Clean controller design and coding standards
- EF Core (SQL Server) with indices and constraints
- Business logic (stock, totals) inside the Orders flow
- JWT Authentication + Role-based Authorization
- Swagger/OpenAPI docs with JWT support
- CORS for React/Angular/Vue dev servers
- Seed data and paging examples

## Tech
- .NET 8 Web API
- EF Core 8 + SQL Server
- BCrypt for password hashing
- JWT Bearer Auth
- Swagger (Swashbuckle)

## Getting Started

1. Install .NET 8 SDK and SQL Server LocalDB (or full SQL Server).
2. Update `LabCourse1.Api/appsettings.json`:
   - `ConnectionStrings:DefaultConnection`
   - `Jwt:Key` (use 32+ chars), `Issuer`, `Audience`
3. In the solution folder, run:
   ```bash
   dotnet restore
   dotnet build
   cd LabCourse1.Api
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   dotnet run
   ```
4. Open Swagger UI at `http://localhost:5000/swagger`.

## API Summary

- `POST /api/auth/register` → returns JWT
- `POST /api/auth/login` → returns JWT
- `GET /api/books` (paging + search)
- `GET /api/books/{id}`
- `POST /api/books` (Admin/Librarian)
- `PUT /api/books/{id}` (Admin/Librarian)
- `DELETE /api/books/{id}` (Admin only)
- `POST /api/orders` (Authorized)
- `GET /api/orders/{id}` (Authorized)

## Roles
- `Admin`, `Librarian`, `User`

## Acceptance Criteria Mapping
- **Browsers Compatibility**: API is backend-only; works with all modern browsers via HTTPS/HTTP requests.
- **Clear API Docs**: Swagger enabled by default (`Program.cs`), JWT auth integrated.
- **Performance**: Indices on `Users.Email`, `Books.Isbn`, `(Author,Title)`, unique constraints on joins.
- **Security**: JWT + role-based `[Authorize]`, password hashing, unique email.
- **Dashboard-ready**: CORS policy `frontend` allows typical dev ports for React/Angular/Vue.

## Notes
- This project is intentionally simple (Books/Orders domain) but clean and extensible.
- You can switch to MySQL/Oracle by changing EF provider packages and `UseMySql`/`UseOracle` call.
