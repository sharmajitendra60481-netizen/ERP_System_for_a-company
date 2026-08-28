# OilERP — Enterprise Resource Planning & Manufacturing Management System

> Industrial-grade ERP for Oil Manufacturing Companies. Built with modern open-source technology. 100% free to develop and self-host.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend | NestJS + TypeScript (Phase 2+) |
| Database | PostgreSQL + Prisma (Phase 2+) |
| Queue | BullMQ + Redis (Phase 2+) |
| Desktop | Electron (Phase 16) |

## Getting Started

### Prerequisites
- Node.js >= 20
- pnpm >= 9

```bash
npm install -g pnpm
```

### Install dependencies

```bash
pnpm install
```

### Run development server

```bash
pnpm dev:web
```

Open [http://localhost:3000](http://localhost:3000)

### Mock login credentials (Phase 1)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@oilerp.com | Admin@123 |
| Finance Manager | finance@oilerp.com | Finance@123 |
| Production Manager | production@oilerp.com | Prod@123 |
| Warehouse Operator | warehouse@oilerp.com | Ware@123 |

## Project Structure

```
oil-erp/
├── apps/
│   ├── web/          ← Next.js frontend
│   └── desktop/      ← Electron shell (Phase 16)
├── packages/
│   ├── ui/           ← Shared component library
│   ├── shared-types/ ← TypeScript interfaces
│   └── config/       ← Tailwind, ESLint, TSConfig
├── database/         ← Prisma schema + migrations (Phase 2+)
├── docs/             ← Architecture docs
└── docker-compose.yml
```

## Demo V1: completed operational flow

This repository now provides a connected, demo-ready manufacturing workflow:

1. Create a supplier, raw material, and purchase order.
2. Approve and receive the purchase order. Raw-material stock increases and a stock-ledger movement is recorded.
3. Create a production batch and complete it. The chosen material is consumed and finished-goods stock is posted.
4. Create and dispatch a sales order. Finished-goods stock is reduced and a dispatch movement is recorded.
5. Create an invoice and record one or more payments. The invoice changes from unpaid to partial or paid.

All stock-changing workflow operations run inside database transactions and reject invalid states or insufficient stock.

## Development Phases

- [x] **Phase 1** — Foundation, UI system, Auth, Portal shell
- [ ] Phase 2 — Users, Roles, Permissions, Organization
- [ ] Phase 3 — Master Data (Products, Customers, Suppliers)
- [ ] Phase 4 — Procurement
- [ ] Phase 5 — Inventory
- [ ] Phase 6 — Manufacturing
- [ ] Phase 7 — Quality Control
- [ ] Phase 8 — Sales
- [ ] Phase 9 — Finance & Accounting
- [ ] Phase 10 — HR & Payroll
- [ ] Phase 11 — Assets, Maintenance, Logistics
- [ ] Phase 12 — Documents, PDF, Email, Notifications
- [ ] Phase 13 — Workflow & Automation
- [ ] Phase 14 — Reports & Analytics
- [ ] Phase 15 — Security, Audit, Backup
- [ ] Phase 16 — Testing, Performance, Desktop Packaging

## License

MIT
