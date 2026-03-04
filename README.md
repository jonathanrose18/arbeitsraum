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

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 9.5 (`npm install -g pnpm`)
- [Docker](https://www.docker.com) (for the database)

### Development setup

**1. Clone and install dependencies**

```bash
git clone https://github.com/jonathanrose18/arbeitsraum.git
cd arbeitsraum
pnpm install
```

**2. Configure environment variables**

```bash
cp .env.example .env
```

The defaults in `.env.example` work out of the box for local development — no changes needed unless you want custom credentials.

**3. Start the database**

```bash
pnpm db-dev:up
```

**4. Run migrations and generate the Prisma client**

```bash
pnpm db:migrate
pnpm db:generate
```

**5. Start the development server**

```bash
pnpm dev
```

The app is now running at [http://localhost:3000](http://localhost:3000).

### Useful commands

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps |
| `pnpm db-dev:up` | Start the local Postgres container |
| `pnpm db-dev:down` | Stop the local Postgres container |
| `pnpm db:migrate` | Create and apply a new migration |
| `pnpm db:generate` | Regenerate the Prisma client after schema changes |
| `pnpm db:studio` | Open Prisma Studio to browse the database |

### Production

```bash
cp .env.example .env  # set secure passwords
pnpm prod:up          # build images, run migrations, start the app
```

## 🤝 Contributing

More information coming soon.

## 📜 License

Distributed under the terms of the included [LICENSE](LICENSE) file. See the license document for more information.
