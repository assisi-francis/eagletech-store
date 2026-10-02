# AGENTS.md — Developer Guidelines & Architecture Context

## 1. Project Overview & Context
You are building **EagleTech Store**, a full-stack e-commerce platform and field service booking system.
* **Core Offerings:**
  1. **Hardware Sales:** Laptops (Apple MacBooks, Dell, HP, Asus), Smartphones (iPhone, Samsung, Redmi, Pixel, Tecno), Storage Drives (HDDs: 150GB–2TB; SSDs: 128GB–1TB), Enclosures (M.2/SATA), Flash Drives, External Mice.
  2. **Starlink Hardware & Services:** Starlink Mini and Standard Kits, plus add-on Installation & Network Distribution Services (mounting, cabling, Wi-Fi access point extension).
* **Target Audience:** Nigerian / West African e-commerce customers + field installation client requests.
* **Future Readiness:** All API endpoints and database logic must be decoupled to support future React Native / Flutter iOS and Android mobile apps.

---

## 2. Core Tech Stack Rules

| Layer | Technology | Usage Directives |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | Use Server Components by default; add `'use client'` only when state/interactivity is required. |
| **Styling** | Tailwind CSS + Shadcn UI | Utility classes only. Follow dark/light mode standards using Radix primitives via Shadcn UI. |
| **Database** | Supabase (PostgreSQL) | Use `@supabase/ssr` on client/server routes. Use `SUPABASE_SERVICE_ROLE_KEY` **only** in server-side webhooks or admin routes. |
| **Auth** | Supabase Auth (Google OAuth) | Configure Google Cloud OAuth redirect via Supabase. Leverage PostgreSQL trigger functions to sync `auth.users` to `public.profiles`. |
| **Payments** | Paystack Webhooks | Always verify cryptographic HMAC signatures (`x-paystack-signature`) before marking orders paid. Convert Naira to Kobo (`amount * 100`). |
| **Emails** | Brevo SDK (`@getbrevo/brevo`) | Trigger emails via server-side routines after webhook verification. |
| **State** | Zustand + React Query | Use Zustand for client-side cart persistence; React Query for backend data fetching. |

---

## 3. Environment Variables Specification

Ensure all generated code assumes these environment variables are set in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=secret-service-role-key

# Paystack Payment Gateway
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxx

# Brevo Transactional Emails
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxx
SENDER_EMAIL=orders@eagletechstore.com
SENDER_NAME=EagleTech Store

# App Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Coding Standards & Conventions

### 4.1 TypeScript Rules
* **Strict Type Checking:** Never use `any`. Define explicit interfaces or types for products, carts, orders, and API responses.
* **Shared Types:** Store common interfaces in `@/types/index.ts`.

### 4.2 Database Access & Security
* All database queries must respect Row-Level Security (RLS) policies.
* Client-side components must use `lib/supabaseClient.ts` (or `@supabase/ssr` `createBrowserClient`).
* Server API routes needing bypass capabilities (e.g., Paystack Webhook updating order status) must use `lib/supabaseAdmin.ts`.

### 4.3 Error Handling & Logging
* API routes must return standard JSON response formats:
  * Success: `{ success: true, data: { ... } }`
  * Error: `{ success: false, error: "Detailed error message" }` with appropriate status code (400, 401, 500).
* Wrap asynchronous API route handlers in `try/catch` blocks.

---

## 5. File Structure Blueprint

When creating or modifying files, adhere strictly to this project layout:

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── callback/route.ts
│   ├── (store)/
│   │   ├── page.tsx (Homepage)
│   │   ├── catalog/page.tsx
│   │   ├── product/[slug]/page.tsx
│   │   └── checkout/
│   │       ├── page.tsx
│   │       └── success/page.tsx
│   ├── api/
│   │   ├── checkout/route.ts
│   │   └── webhooks/
│   │       └── paystack/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (Shadcn components)
│   ├── navbar.tsx
│   ├── product-card.tsx
│   ├── cart-sheet.tsx
│   └── starlink-addon-picker.tsx
├── lib/
│   ├── supabaseClient.ts
│   ├── supabaseAdmin.ts
│   └── brevo.ts
├── store/
│   └── useCartStore.ts (Zustand)
├── types/
│   └── index.ts
└── AGENTS.md
```

---

## 6. Key Integration Workflow Rules

1. **Creating Orders & Initializing Paystack:**
   * When user clicks checkout, call `POST /api/checkout`.
   * Insert order in Supabase with `payment_status = 'PENDING'`.
   * Initialize Paystack transaction and return `authorization_url`.

2. **Handling Paystack Webhooks:**
   * Read raw text body before JSON parsing to calculate HMAC SHA-512 signature using `PAYSTACK_SECRET_KEY`.
   * Compare against header `x-paystack-signature`.
   * If `event === 'charge.success'`, update order in `public.orders` to `payment_status = 'SUCCESSFUL'`.
   * Call `sendOrderConfirmationEmail` from `lib/brevo.ts`.

3. **Starlink Field Service Logic:**
   * If cart contains Starlink hardware or setup services, ensure `installation_notes` and target address are recorded during checkout and stored in the `orders` table.

---

## 7. Instructions for AI Assistance

When writing or refactoring code:
* Always provide complete, runnable code files rather than partial snippets.
* Do not introduce extra dependencies unless requested or specified in the tech stack.
* Maintain clean CSS using standard Tailwind classes.