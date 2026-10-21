# 10 — DevOps, CI/CD & Deployment Architecture

## 1. DevOps & Infrastructure Summary

| Area | Current State | Assessment | Recommended Action |
| :--- | :--- | :--- | :--- |
| **CI/CD Pipeline** | **MISSING** | No `.github/workflows/` or GitLab CI configuration exists. | Create GitHub Actions workflow for linting, type-checking, and build validation. |
| **Containerization** | **MISSING** | No `Dockerfile` or `docker-compose.yml`. | Add multi-stage Dockerfile for containerized deployment (e.g., AWS ECS, Render, Railway). |
| **Target Hosting** | **Vercel Serverless** | Supported via Next.js App Router defaults; `@vercel/analytics` is in `package.json`. | Deploy to Vercel with serverless database (Supabase / Neon / AWS RDS). |
| **Database Migrations** | **Prisma CLI** | `package.json` build script runs `prisma generate && next build`. | Add `prisma migrate deploy` to the production release step. |
| **Observability & APM**| **MINIMAL** | Raw `console.error()` statements; no centralized APM or error tracker. | Mount `@vercel/analytics` and integrate Sentry for runtime exception tracking. |
| **Disaster Recovery** | **MISSING** | No database backup automation or point-in-time recovery strategy. | Enable automated daily snapshots and WAL backups on the managed PostgreSQL instance. |

---

## 2. Environment Variables & Configuration Requirements

The repository lacks a `.env.example` file. The following variables are required for a functional deployment:

| Variable Name | Required By | Secret? | Description & Example |
| :--- | :--- | :---: | :--- |
| `DATABASE_URL` | [`prisma.config.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/prisma.config.ts#L10), [`lib/prisma.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/prisma.ts#L4) | **YES** | PostgreSQL connection string: `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `JWT_SECRET` | [`lib/auth.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/auth.ts#L8), [`app/api/auth/login/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/auth/login/route.ts#L40) | **YES** | 64-character high-entropy secret for signing JWTs. |
| `GOOGLE_CLIENT_ID` | [`app/api/auth/[...nextauth]/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/auth/[...nextauth]/route.ts#L8) | No | Google Cloud Console OAuth 2.0 Web Client ID. |
| `GOOGLE_CLIENT_SECRET` | [`app/api/auth/[...nextauth]/route.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/api/auth/[...nextauth]/route.ts#L9) | **YES** | Google Cloud Console OAuth 2.0 Web Client Secret. |
| `NEXTAUTH_SECRET` | NextAuth Core | **YES** | Mandatory in production for session cookie encryption. |
| `NEXTAUTH_URL` | NextAuth Core | No | Canonical origin URL: `https://crystalflora.in` |
| `NEXT_PUBLIC_WHATSAPP` | Recommended | No | Merchant WhatsApp contact number: `918109142426` |
| `RAZORPAY_KEY_ID` | Recommended | No | Razorpay merchant public key for future payment gateway. |
| `RAZORPAY_KEY_SECRET` | Recommended | **YES** | Razorpay merchant secret key for webhook & signature verification. |

---

## 3. Recommended Multi-Stage Dockerfile

A production-ready `Dockerfile` (currently missing) should look like:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 4. Recommended GitHub Actions CI/CD Pipeline

A workflow file `.github/workflows/ci.yml` (currently missing) to validate pull requests:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run lint
      - run: npm audit --audit-level=critical
      - run: npm run build
```

---

## 5. DevOps Issues & Gaps Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| Root | Missing `.env.example` file documenting required environment variables. | **High** | Create `.env.example` with placeholders for all secrets. |
| Root | Missing `.github/workflows/` automated CI pipeline. | **High** | Add GitHub Actions workflow for linting, security scanning, and building. |
| Root | Missing `Dockerfile` and `docker-compose.yml`. | **Medium** | Add multi-stage Docker build files for standardized deployment. |
| [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx) | `@vercel/analytics` is installed but `<Analytics />` component is never mounted. | **Low** | Import `<Analytics />` from `@vercel/analytics/react` and place inside root body. |
