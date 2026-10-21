# 13 — Dependencies & Package Audit

## 1. Complete Package Manifest & Usage Audit

### 1.1 Runtime Dependencies (`dependencies`)

| Package Name | Version | Actual Usage in Codebase | Status |
| :--- | :--- | :--- | :---: |
| `@base-ui/react` | `^1.5.0` | UI component primitives | **ACTIVE** |
| `@hookform/resolvers` | `^5.4.0` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `@prisma/adapter-pg` | `^7.8.0` | Configured in [`lib/prisma.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/prisma.ts) for PostgreSQL pool | **ACTIVE** |
| `@prisma/client` | `^7.8.0` | Core database query client | **ACTIVE** |
| `@radix-ui/react-slot` | `^1.2.4` | Used in `components/ui/button.tsx` | **ACTIVE** |
| `@tanstack/react-query`| `^5.100.14`| **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `@vercel/analytics` | `^2.0.1` | Installed, but `<Analytics />` is never imported | **UNUSED** |
| `bcryptjs` | `^3.0.3` | Password hashing in seed and auth endpoints | **ACTIVE** |
| `class-variance-authority` | `^0.7.1` | Variant styling in buttons and badges | **ACTIVE** |
| `cloudinary` | `^2.10.0` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `clsx` | `^2.1.1` | Class joining in [`lib/utils.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/utils.ts) | **ACTIVE** |
| `jsonwebtoken` | `^9.0.3` | JWT issuance and verification in [`lib/auth.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/auth.ts) | **ACTIVE** |
| `lucide-react` | `^1.17.0` | Icons throughout customer and admin UI | **ACTIVE** |
| `next` | `16.2.6` | Next.js App Router framework (**CRITICAL CVEs**) | **VULNERABLE** |
| `next-auth` | `^4.24.14` | Configured in `app/api/auth/[...nextauth]` (**CRITICAL CVEs**) | **VULNERABLE** |
| `next-cloudinary` | `^6.17.5` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `next-themes` | `^0.4.6` | Wrapped in `components/ui/theme-provider.tsx` but never mounted | **DEAD CODE** |
| `pg` | `^8.21.0` | Underlying PostgreSQL driver for Prisma Pg adapter | **ACTIVE** |
| `razorpay` | `^2.9.6` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `react` | `19.2.4` | React 19 core library | **ACTIVE** |
| `react-dom` | `19.2.4` | React DOM renderer | **ACTIVE** |
| `react-hook-form` | `^7.76.1` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `shadcn` | `^4.8.3` | CLI utility (incorrectly placed in runtime dependencies) | **MISPLACED** |
| `sonner` | `^2.0.7` | Toast feedback system in [`app/layout.tsx`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/layout.tsx) | **ACTIVE** |
| `tailwind-merge` | `^3.6.0` | Tailwind class merger in [`lib/utils.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/utils.ts) | **ACTIVE** |
| `tw-animate-css` | `^1.4.0` | CSS animations imported in [`app/globals.css`](file:///c:/B.tech/3rd%20sem/DBMS/Project/app/globals.css) | **ACTIVE** |
| `zod` | `^4.4.3` | **ZERO USAGES** across the entire codebase | **DEAD CODE** |
| `zustand` | `^5.0.14` | Cart and Wishlist store in [`lib/store.ts`](file:///c:/B.tech/3rd%20sem/DBMS/Project/lib/store.ts) | **ACTIVE** |

### 1.2 Development Dependencies (`devDependencies`)

| Package Name | Version | Usage |
| :--- | :--- | :--- |
| `@tailwindcss/postcss` | `^4` | Tailwind CSS v4 PostCSS compilation pipeline |
| `@types/bcryptjs` | `^2.4.6` | TypeScript types for bcryptjs |
| `@types/jsonwebtoken` | `^9.0.10` | TypeScript types for jsonwebtoken |
| `@types/node` | `^20` | Node.js environment typings |
| `@types/react` | `^19` | React 19 typings |
| `@types/react-dom` | `^19` | React DOM typings |
| `eslint` | `^9` | Flat-config linter engine |
| `eslint-config-next` | `16.2.6` | Next.js standard lint rules |
| `prisma` | `^7.8.0` | Prisma schema generator, seeder, and migration CLI |
| `tailwindcss` | `^4` | Tailwind CSS v4 compiler |
| `typescript` | `^5` | TypeScript compiler |

---

## 2. Bloat Analysis: Unused Dead Dependencies

The following packages are installed in `node_modules` and declared in `package.json`, but **are never imported or referenced in project source files**:

```
Unused Package Count: 8 major dependencies
Estimated Unused Bundle/Node Size: ~48 MB in node_modules

1. @tanstack/react-query (^5.100.14)
2. zod (^4.4.3)
3. react-hook-form (^7.76.1)
4. @hookform/resolvers (^5.4.0)
5. razorpay (^2.9.6)
6. cloudinary (^2.10.0)
7. next-cloudinary (^6.17.5)
8. next-themes (^0.4.6)
```

Additionally, `shadcn` (`^4.8.3`) is a development CLI scaffolding tool, yet it is located in the runtime `dependencies` block instead of `devDependencies`.

---

## 3. Security Vulnerability Scan (`npm audit`)

Running `npm audit` on the project produces:
```
37 vulnerabilities (1 low, 7 moderate, 26 high, 3 critical)
```

### Critical Vulnerabilities Requiring Immediate Remediation:
1. **Next.js (16.2.6)**:
   - *GHSA-p293-qw3h-jr36*: Unauthenticated Remote Code Execution on Windows-hosted servers.
   - *GHSA-2xp9-vwfh-vxw4*: Remote Code Execution in Image Optimization API when AVIF files are used.
   - *Remediation*: Upgrade to `next@16.4.2` or later via `npm install next@latest`.
2. **NextAuth (4.24.14)**:
   - *GHSA-7rqj-j65f-68wh*: Email normalizer validation bypass via Unicode homoglyphs.
   - *Remediation*: Upgrade to `next-auth@latest` or migrate to Auth.js v5.
3. **proxy-addr (2.0.7)**:
   - *GHSA-jqcg-44mw-7w3h*: IP address spoofing.
   - *Remediation*: Run `npm audit fix`.

---

## 4. Dependencies Issues Table

| File Path | Issue | Severity | Fix Suggestion |
| :--- | :--- | :--- | :--- |
| [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json#L25) | `next@16.2.6` contains critical Remote Code Execution vulnerability on Windows servers. | **Critical** | Upgrade to `next@16.4.2` or latest. |
| [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json#L26) | `next-auth@4.24.14` has critical homoglyph email bypass. | **Critical** | Upgrade `next-auth` to patched version. |
| [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json) | 8 dead packages bloated in `package.json` (`@tanstack/react-query`, `zod`, `razorpay`, etc.). | **Medium** | Uninstall unused packages or implement their corresponding features. |
| [`package.json`](file:///c:/B.tech/3rd%20sem/DBMS/Project/package.json#L34) | `shadcn` is in `dependencies` instead of `devDependencies`. | **Low** | Move `shadcn` to `devDependencies`. |
