# cashflow-dashboard

Personal finance dashboard built with React + TypeScript, Tailwind CSS, shadcn/ui, Recharts, and Lucide icons.

## Features

- Responsive dashboard at 320px, 768px, and 1280px breakpoints
- Stat cards for key financial metrics
- Spending donut chart and balance trend chart
- Recent transactions list
- Add transaction modal with validation
- Dark and light mode with persisted preference
- Typed API utilities with structured error mapping

## Architecture Overview

The app is organized by feature and shared layers:

- `src/pages`: page-level composition (`dashboard-page.tsx`)
- `src/components/dashboard`: dashboard UI building blocks (stats, charts, transactions, dialog)
- `src/components/theme`: theme controls and persistence behavior
- `src/components/ui`: shared shadcn/ui primitives
- `src/lib/schemas`: Zod schemas and validation types
- `src/lib/types`: reusable TypeScript domain models
- `src/lib/api`: typed API client + transaction API utilities
- `src/hooks`: data orchestration hooks for dashboard state/loading/errors
- `src/styles`: global Tailwind and design token styles
- `src/test`: dashboard and API behavior tests

## Component Map

- `DashboardPage`
- `TopBar`
- `ThemeToggle`
- `StatCard` (x4)
- `SpendingDonutChart`
- `BalanceTrendChart`
- `TransactionList`
- `AddTransactionDialog`

## Environment Variables

Create `.env` from `.env.example`:

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for backend API requests
- `NEXT_PUBLIC_TRANSACTIONS_MODE`: `mock` or `api`

## Scripts

Use npm only.

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run test`
- `npm run lint`

## Manual QA Checklist

- Layout and spacing are usable at 320px, 768px, and 1280px
- Add transaction dialog validates required fields and invalid values
- Successful submission updates transaction list
- Failed submission shows structured error message
- Theme toggle updates UI and persists after reload
- Chart tooltips and legends render correctly in light and dark mode
