<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./logo-white.svg">
    <source media="(prefers-color-scheme: light)" srcset="./logo-black.svg">
    <img alt="arbeitsraum logo" src="./logo-black.svg" width="25%">
  </picture>
</p>

<div>
  <p align="center">
    <b>arbeitsraum</b>
    <br />an open source self hosted workspace for developers that helps them stay in flow
  </p>
</div>

## 🚀 Self-hosting

Requires [Docker](https://www.docker.com).

```bash
git clone https://github.com/jonathanrose18/arbeitsraum.git
cd arbeitsraum
./setup.sh
```

`setup.sh` copies `.env.example` to `.env`, generates a secure `BETTER_AUTH_SECRET`, and starts the app. That's it.

The app will be available at [http://localhost:3000](http://localhost:3000).

### Deploying with Coolify or similar

1. Point Coolify at this repository
2. Set these environment variables in the dashboard:

| Variable             | Description                                |
| -------------------- | ------------------------------------------ |
| `POSTGRES_DB`        | Database name                              |
| `POSTGRES_USER`      | Database user                              |
| `POSTGRES_PASSWORD`  | **Use a strong password**                  |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` to generate  |
| `BETTER_AUTH_URL`    | The URL your app is publicly accessible at |

Everything else (`PORT`, `POSTGRES_PORT`) can stay at defaults.

## 💻 Development

Requires [Node.js](https://nodejs.org) >= 18, [pnpm](https://pnpm.io) >= 9.5, and [Docker](https://www.docker.com).

```bash
git clone https://github.com/jonathanrose18/arbeitsraum.git
cd arbeitsraum
pnpm install
cp .env.example .env
pnpm db-dev:up
pnpm db:migrate
pnpm dev
```

The app is now running at [http://localhost:3000](http://localhost:3000).

### Useful commands

| Command            | Description                                       |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Start all apps in development mode                |
| `pnpm build`       | Build all apps                                    |
| `pnpm db-dev:up`   | Start the local Postgres container                |
| `pnpm db-dev:down` | Stop the local Postgres container                 |
| `pnpm db:migrate`  | Create and apply a new migration                  |
| `pnpm db:generate` | Regenerate the Prisma client after schema changes |
| `pnpm db:studio`   | Open Prisma Studio to browse the database         |

## 🤝 Contributing

More information coming soon.

## 📜 License

Distributed under the terms of the included [LICENSE](LICENSE) file. See the license document for more information.
