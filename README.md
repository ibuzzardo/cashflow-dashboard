# cashflow-dashboard

> Built with [Dark Factory v4](https://github.com/ibuzzardo/dark-factory-v4) — autonomous AI software development pipeline

**[Live Demo](https://cashflow-dashboard-omega.vercel.app)**

Personal finance dashboard built with React + TypeScript, Tailwind CSS, shadcn/ui, Recharts, and Lucide icons.

## Features

- Responsive dashboard at 320px, 768px, and 1280px breakpoints
- Stat cards for key financial metrics
- Spending donut chart and balance trend chart
- Recent transactions list
- Add transaction modal with validation
- Dark and light mode with persisted preference
- Typed API utilities with structured error mapping

## Tech Stack

- Next.js 15, TypeScript, Tailwind CSS
- shadcn/ui component library
- Recharts for data visualisation
- Lucide icons
- Zod for schema validation

## Getting Started

```bash
git clone https://github.com/ibuzzardo/cashflow-dashboard.git
cd cashflow-dashboard
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env` from `.env.example`:

- `NEXT_PUBLIC_API_BASE_URL` — Base URL for backend API requests
- `NEXT_PUBLIC_TRANSACTIONS_MODE` — `mock` or `api`

## Architecture

The app is organised by feature and shared layers:

- `src/pages` — page-level composition
- `src/components/dashboard` — dashboard UI (stats, charts, transactions, dialog)
- `src/components/theme` — theme controls and persistence
- `src/components/ui` — shared shadcn/ui primitives
- `src/lib/schemas` — Zod schemas and validation types
- `src/lib/types` — reusable TypeScript domain models
- `src/lib/api` — typed API client + transaction utilities
- `src/hooks` — data orchestration hooks
- `src/test` — dashboard and API behaviour tests

## Pipeline Stats

- **Sprint cost:** ~$1.30
- **Coder passes:** 1

## License

MIT — see [LICENSE](LICENSE)
