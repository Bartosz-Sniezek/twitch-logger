# Twitch Logger

A full-stack application for logging and tracking Twitch chat data, built with NestJS backend and Next.js frontend in a pnpm workspace monorepo.

## Tech Stack

- **Backend**: NestJS, TypeScript, TypeORM, PostgreSQL, Redis, tmi.js
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, TanStack Query
- **Shared**: Common types and utilities (workspace package)
- **Package Manager**: pnpm (workspace monorepo)

## Prerequisites

- Node.js v24.12.0 (required)
- pnpm 9.15.4 (required)
- Docker and Docker Compose (for backend dependencies)

**Note**: This project enforces specific Node.js and pnpm versions.

## Getting Started

### 1. Install pnpm

If you don't have pnpm installed, install version 9.15.4 or higher:

```bash
npm install -g pnpm@9.15.4
```

Verify your pnpm version:
```bash
pnpm --version  # Should be 9.15.4 or higher
```

### 2. Verify Node.js Version

Check your Node.js version:

```bash
node --version  # Should be v24.12.0 or higher
```

### 3. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd twitch-logger

# Install all workspace dependencies
pnpm install
```

### 4. Start Backend Dependencies

The backend requires PostgreSQL and Redis. These are managed via Docker Compose in the `.dev/` directory:

```bash
# Start PostgreSQL and Redis containers
pnpm docker:deps:up

# To stop the containers when done
pnpm docker:deps:down
```

**Services started:**
- **PostgreSQL 16.1** - Available at `localhost:5432`
  - Database: `twitch_logger_dev`
  - User: `postgres`
  - Password: `postgres`
- **Redis 7.4** - Available at `localhost:6379`
  - Password: `yourpassword`

### 5. Configure Backend Environment Variables

The backend uses environment-specific config files based on `NODE_ENV`:
- `development` → `.env.development` (default for development)
- `production` → `.env`
- `test` → `.env.test`

Create or update `apps/backend/.env.development`:

```env
NODE_ENV=development
PORT=8080

# CORS configuration (semicolon-separated for multiple origins)
ALLOWED_ORIGINS=http://localhost:3000

# Database connection
DATABASE_URL=postgres://postgres:postgres@localhost:5432/twitch_logger_dev

# Redis connection
REDIS_URL=redis://default:yourpassword@localhost:6379

# Twitch API credentials (get from https://dev.twitch.tv/console)
TWITCH_API_CLIENT_ID=your_client_id_here
TWITCH_API_CLIENT_PASSWORD=your_client_secret_here
```

**Required environment variables** (validated by Zod schema):
- `NODE_ENV` - Environment (development/production/test)
- `PORT` - Server port (number)
- `ALLOWED_ORIGINS` - CORS origins (semicolon-separated string)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `TWITCH_API_CLIENT_ID` - Twitch API client ID
- `TWITCH_API_CLIENT_PASSWORD` - Twitch API client secret

**Note**: A sample `.env.example` file already exists in `apps/backend/` with example values. You'll need to update the Twitch API credentials with your own from the [Twitch Developer Console](https://dev.twitch.tv/console).

### 6. Configure Frontend Environment Variables (Optional)

If your frontend needs to connect to the backend API:

Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 7. Run Database Migrations

```bash
cd apps/backend

# Run pending migrations
pnpm migration:run

# Verify migrations (optional)
pnpm migration:list
```

### 8. Start Development Servers

Open separate terminal windows/tabs for each service:

**Backend** (runs on port 8080):
```bash
cd apps/backend
pnpm start:dev
```

**Frontend** (runs on port 3000):
```bash
cd apps/frontend
pnpm dev
```

## Running Backend with Docker

Instead of running the backend locally, you can build and run it in a Docker container:

### 1. Build the Docker Image

```bash
# From the root directory
pnpm docker:backend:build
```

This creates a multi-stage Docker image that:
- Builds the shared package
- Builds the backend application
- Creates a production-ready image with only runtime dependencies

### 2. Run the Container

**Foreground (with logs):**
```bash
pnpm docker:backend:run
```

**Background (detached):**
```bash
pnpm docker:backend:run:detached
```

**Stop the container:**
```bash
pnpm docker:backend:stop
```

**Important Notes:**
- Environment variables are loaded from `apps/backend/.env`
- Make sure PostgreSQL and Redis are running (`pnpm docker:deps:up`) before starting the backend container
- The container uses `--network twitch_logger-infra_backend_deps` to access PostgreSQL and Redis on localhost. Make sure to set valid host values for PostgreSQL and Redis urls.
- The container runs on port 8080

## Running Frontend with Docker

Instead of running the frontend locally, you can build and run it in a Docker container:

### 1. Build the Docker Image

```bash
# From the root directory
pnpm docker:frontend:build
```

This creates a multi-stage Docker image that:
- Builds the frontend application
- Creates a production-ready image with only runtime dependencies

### 2. Run the Container

**Foreground (with logs):**
```bash
pnpm docker:frontend:run
```

**Background (detached):**
```bash
pnpm docker:frontend:run:detached
```

**Stop the container:**
```bash
pnpm docker:frontend:stop
```

**Important Notes:**
- Environment variables are loaded from `apps/frontend/.env`
- The container runs on port 3000

## Available Scripts

### Root Level

**Infrastructure:**
- `pnpm docker:deps:up` - Start PostgreSQL and Redis containers
- `pnpm docker:deps:down` - Stop PostgreSQL and Redis containers

**Backend Docker:**
- `pnpm docker:backend:build` - Build backend Docker image
- `pnpm docker:backend:run` - Run backend container (foreground)
- `pnpm docker:backend:run:detached` - Run backend container (background)
- `pnpm docker:backend:stop` - Stop and remove backend container

**Frontend Docker:**
- `pnpm docker:frontend:build` - Build frontend Docker image
- `pnpm docker:frontend:run` - Run frontend container (foreground)
- `pnpm docker:frontend:run:detached` - Run frontend container (background)
- `pnpm docker:frontend:stop` - Stop and remove frontend container

### Backend (`apps/backend`)

**Development:**
- `pnpm start:dev` - Start development server with hot reload
- `pnpm start:debug` - Start with debugger

**Production:**
- `pnpm build` - Build for production
- `pnpm start:prod` - Start production server

**Code Quality:**
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier

**Testing:**
- `pnpm test` - Run unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:cov` - Generate test coverage report
- `pnpm test:e2e` - Run end-to-end tests

**Database Migrations:**
- `pnpm migration:create` - Create a new migration
- `pnpm migration:run` - Run pending migrations
- `pnpm migration:list` - List all migrations and their status
- `pnpm migration:revert` - Revert the last migration

### Frontend (`apps/frontend`)

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
twitch-logger/
├── .dev/                       # Development dependencies
│   └── docker-compose.yaml     # PostgreSQL & Redis containers
├── apps/
│   ├── backend/                # NestJS backend application
│   │   ├── src/
│   │   │   ├── main.ts         # Application entry point
│   │   │   ├── app.module.ts   # Root module
│   │   │   └── modules/
│   │   │       ├── app-config/ # Environment configuration
│   │   │       ├── database/   # TypeORM setup
│   │   │       └── twitch/     # Twitch integration
│   │   └── .env.development    # Development environment variables
│   └── frontend/               # Next.js frontend application
├── packages/
│   └── shared/                 # Shared types and utilities
├── package.json                # Root package.json with workspace scripts
└── pnpm-workspace.yaml         # pnpm workspace configuration
```

## Environment Configuration Details

The backend uses a Zod schema for environment validation (see `apps/backend/src/modules/app-config/app-env-configuration.ts:6`). All required variables must be present or the application will fail to start with a validation error.

The application automatically loads the correct `.env` file based on `NODE_ENV`:
- Set `NODE_ENV=development` (default) to load `.env.development`
- Set `NODE_ENV=production` to load `.env`
- Set `NODE_ENV=test` to load `.env.test`

### Port Conflicts

Default ports used:
- `5432` - PostgreSQL
- `6379` - Redis
- `8080` - Backend API
- `3000` - Frontend

If ports are in use, either stop conflicting services or update ports in:
- `.dev/docker-compose.yaml` (PostgreSQL, Redis)
- `apps/backend/.env.development` (PORT, DATABASE_URL, REDIS_URL)
- `apps/frontend/.env.local` (NEXT_PUBLIC_API_URL)

### Environment Variable Errors

If you see validation errors on startup, ensure all required variables in the schema are set:
- Check `apps/backend/src/modules/app-config/app-env-configuration.ts:6` for the schema
- Verify your `.env.development` file matches the requirements
- Make sure `NODE_ENV` is set correctly

## Getting Twitch API Credentials

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Log in with your Twitch account
3. Click "Register Your Application"
4. Fill in the required fields:
   - Name: Your app name
   - OAuth Redirect URLs: `http://localhost:8080/auth/callback` (for development)
   - Category: Choose appropriate category
5. Copy the **Client ID** and **Client Secret**
6. Add them to your `.env.development` file

## License

UNLICENSED
