# 🪙 OldGold

> Turning old into gold.

OldGold is a marketplace platform where users can buy and sell second-hand items. The app is built with **React + Vite** and uses **Supabase** for authentication, database, storage, and edge functions.

---

## 🚀 Features

- 🏠 Buy & sell used household items
- 📦 Category-based browsing
- 👤 Seller onboarding and profile completion
- 🛒 Product listing with images and pricing
- 🔐 Supabase authentication + role-based access
- 🧑‍💼 Admin moderation (supreme admin/admin)
- ✅ Product approval and seller workflows
- 📱 Responsive UI

---

## 🏗️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Backend:** Supabase (Postgres + Auth + Storage + Edge Functions)
- **Deployment:** Vercel (frontend) + Supabase (backend)

---

## ⚙️ Local Setup

```bash
# 1) Install deps
npm install

# 2) Create .env from example values
# Required:
# VITE_SUPABASE_URL
# VITE_SUPABASE_PUBLISHABLE_KEY

# 3) Start app
npm run dev
```

Build/test/lint:

```bash
npm run lint
npm run build
npm test
```

---

## 🌐 Vercel Deployment Checklist

1. Import repo into Vercel.
2. Set framework preset to **Vite**.
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy. A `vercel.json` rewrite is included so React Router routes work on refresh.

---

## 🗄️ Database / Supabase Checklist

1. In Supabase, run migrations from `supabase/migrations`.
2. Deploy edge functions in `supabase/functions` (for admin operations).
3. Ensure RLS policies and RPC functions used by the app are present.
4. Confirm storage buckets used by the app exist (e.g., product/team photos).

---

## 📜 License

© 2026 Anish Kushwaha • All rights reserved.
