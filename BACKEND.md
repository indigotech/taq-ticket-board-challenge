# Ticket Board — Backend

Elysia REST API for the Ticket Board challenge: an Nx monorepo with Bun as runtime, package manager and test
runner.

## Stack

- [Bun](https://bun.com/) — runtime, package manager, test runner
- [Elysia](https://elysiajs.com/) — HTTP framework
- [Drizzle](https://orm.drizzle.team/) — ORM (PostgreSQL)
- [Zod](https://zod.dev/) — request/response validation
- [Nx](https://nx.dev/) — monorepo task orchestration

## Setup

```bash
docker compose up -d --wait   # start the dev + test Postgres containers
bun install                   # install dependencies for every app/package
bun run migrate               # apply migrations to the local (dev) database
```

Copy `apps/rest-server/.env` and the root `.env` if they don't exist yet. `loadEnv` (in `@repo/env`) reads
the root file first, then lets the app's own file override it, and validates the result against the app's
Zod schema (`apps/rest-server/src/env/env-schema.ts`).

Run the server:

```bash
bun run dev
```

The API is served under `/api/v1`. With `OPEN_API_SCHEMA_VISIBLE=true` (the default in `.env`/`test.env`),
the OpenAPI docs are at `/api/v1/docs`.

## Testing

```bash
bun run test                                                        # every workspace
bunx nx test @repo/rest-server                                      # just rest-server
bunx nx test @repo/rest-server -t "should create quest"             # filter by test name
bunx nx test @repo/rest-server src/api/quests/quests.post.test.ts   # a single file
```

Tests run against the `test` Postgres container (`test.env`), truncated between tests (see
`apps/rest-server/test/`: `RequestMaker`, seeds, checkers).

## Code quality

```bash
bun run lint          # oxlint + oxfmt --check
bun run lint:fix      # oxlint --fix + oxfmt
bun run typecheck     # tsc --noEmit across every workspace
bun run packages:check  # dependency-version consistency (syncpack)
```

## Architecture

Clean Architecture, one feature spanning three layers under `apps/rest-server/src/`:

- **`api/`** — Elysia controllers + Zod payload schemas (presentation)
- **`domain/`** — use cases and business rules, plus pure models in `domain/model/` (application)
- **`data/`** — Drizzle datasources, one file per entity (data)

`api/` and `data/` never import from each other — both depend on `domain/`, never the other way around.

## Quests feature

The only feature implemented so far. `GET /quests` (optional `status` filter, paginated), `GET /quests/:id`,
and `POST /quests` — see [`apps/rest-server/src/api/quests/`](apps/rest-server/src/api/quests/).
