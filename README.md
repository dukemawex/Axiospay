# Axios Pay — Cross-Border FX, Unlocked

A cross-border African currency exchange platform enabling seamless FX swaps across supported African corridors.

## Supported Corridors (MVP)

- NGN ↔ UGX
- NGN ↔ KES
- NGN ↔ GHS
- UGX ↔ KES

## Tech Stack

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL + Redis
- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Zustand
- **Payments**: Interswitch Gateway
- **Infra**: Docker, DigitalOcean App Platform

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- npm >= 10

### Local Development

```bash
# Start Postgres + Redis
docker-compose -f infra/docker-compose.yml up -d

# Install dependencies
npm install

# Set up environment
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Run database migrations
cd apps/api && npx prisma migrate dev

# Start dev servers
npm run dev
```

The API will be available at `http://localhost:4000`  
The web app will be available at `http://localhost:3000`

## Project Structure

```
axiospay/
├── apps/
│   ├── api/       # Express backend
│   └── web/       # Next.js frontend
├── infra/         # Docker + deployment configs
└── .github/       # CI/CD workflows
```

## Environment Variables

See `.env.example` for all required environment variables.