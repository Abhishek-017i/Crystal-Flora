# Architecture — Crystal Flora

**Stack**: Next.js 16 App Router → API Routes → Prisma 7 → PostgreSQL (Supabase)
**Auth**: Custom JWT (Bearer) + NextAuth (Google, deprecated tonight)
**State**: Zustand (cart) + server fetch

## 1. End-to-End Pipeline