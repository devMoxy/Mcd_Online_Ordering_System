# McDonald's Online Ordering System (Clone)

A Spring Boot backend for a McDonald's-style ordering system, built for deployment on AWS App Runner + RDS Postgres.

## Project structure

```
src/main/java/com/mcdonaldsclone/
├── config/          Security config, CORS, bean definitions
├── controller/       REST endpoints (auth, menu, orders, admin)
├── dto/
│   ├── request/       Incoming request payloads
│   └── response/      Outgoing response payloads
├── entity/            JPA entities (User, MenuItem, Order, OrderItem, Category)
├── enums/              OrderStatus, Role, etc.
├── exception/         Custom exceptions + global exception handler
├── mapper/            Entity <-> DTO conversion helpers
├── repository/        Spring Data JPA repositories
├── security/          JWT filter, token utility, UserDetailsService
├── service/           Business logic interfaces
│   └── impl/           Implementations
└── util/               Small shared helpers

src/main/resources/
├── application.yml     Config (reads from env vars, has local defaults)
└── db/migration/        Flyway SQL migration scripts (V1__..., V2__...)
```

Each empty package has a `package-info.java` with a one-line description of what belongs there, so it survives being committed to git (empty folders otherwise get dropped) and IntelliJ shows what each one is for.

## Getting started

1. Open this folder in IntelliJ as a Maven project (`File > Open`, point at the folder — IntelliJ will detect `pom.xml`).
2. Start local Postgres: `docker compose up -d`
3. Run `McdonaldsCloneApplication`. It connects to `localhost:5432/mcdonalds_clone` by default — no env vars needed for local dev.
4. Add Flyway migration scripts under `src/main/resources/db/migration` as you build out entities (e.g. `V1__init_schema.sql`).

## Suggested build order

1. `entity` — User, MenuItem, Category, Order, OrderItem
2. `repository` — matching Spring Data JPA interfaces
3. `enums` — OrderStatus, Role
4. `dto` — request/response shapes per endpoint
5. `service` (+ `impl`) — business logic
6. `controller` — wire up REST endpoints
7. `security` — JWT auth
8. `exception` — global error handling

## Deployment (AWS)

- Containerize with a `Dockerfile` (multi-stage Maven build)
- Push image to ECR
- Deploy via App Runner, pointed at an RDS Postgres instance
- Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` as environment variables in App Runner
