# Deployment Guide: PlanFlow

This guide covers how to deploy the PlanFlow application to Vercel, which is the recommended platform for Next.js applications.

## 1. Prerequisites (Accounts)

Ensure you have accounts and projects set up for:
*   **Vercel** (Hosting)
*   **Supabase** (Database & Auth)
*   **Stripe** (Payments)
*   **OpenAI** (AI Generation)

## 2. Environment Variables

You will need to configure the following Environment Variables in your Vercel Project Settings:

| Variable Name | Description | Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Public Key | Supabase Dashboard > Settings > API |
| `DATABASE_URL` | Connection string to your PostgreSQL DB | Supabase > Settings > Database > Connection String (URI). **Password required.** |
| `OPENAI_API_KEY` | Your OpenAI API Key | OpenAI Platform > API Keys |
| `STRIPE_SECRET_KEY` | Stripe Secret Key (`sk_live_...` or `sk_test_...`) | Stripe > Developers > API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key (`pk_live_...` or `pk_test_...`) | Stripe > Developers > API Keys |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhooks (`whsec_...`) | Stripe > Developers > Webhooks (after creating endpoint) |
| `NEXT_PUBLIC_BASE_URL` | The URL of your deployed site (e.g., `https://planflow.vercel.app`) | Vercel (after first deploy) |

## 3. Database Deployment

PlanFlow uses Prisma. You need to verify your database schema is in sync with production.

**Option A: Manual Push (Recommended for MVP)**
Run this command locally, but ensure your `.env` file lists the *production* `DATABASE_URL` momentarily (or pass it in the command).

```bash
npx prisma db push
```

**Option B: Migrations**
If you want to robustly manage changes, start using migrations locally:
`npx prisma migrate dev --name init`
And in your Vercel Build Command, verify it runs `prisma generate`. (Vercel usually handles `prisma generate` automatically).

## 4. Vercel Deployment Steps

1.  **Push Code:** Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  **Import Project:** Go to Vercel Dashboard -> "Add New..." -> "Project" -> Import your repository.
3.  **Configure Settings:**
    *   **Framework Preset:** Next.js
    *   **Root Directory:** `./`
4.  **Environment Variables:** Copy/Paste all the variables from Section 2 into the "Environment Variables" section.
5.  **Deploy:** Click "Deploy".

## 5. Post-Deployment Configuration

### A. Supabase Auth Redirects
1.  Go to Supabase Dashboard > Authentication > URL Configuration.
2.  Add your Production URL to **Site URL** (e.g., `https://planflow.vercel.app`).
3.  Add it to **Redirect URLs** (e.g., `https://planflow.vercel.app/**`).

### B. Stripe Webhooks
1.  Go to Stripe Dashboard > Developers > Webhooks.
2.  Add Endpoint: `https://your-project.vercel.app/api/stripe/webhook`
3.  Select events to listen to:
    *   `checkout.session.completed`
    *   `invoice.payment_succeeded`
4.  Copy the **Signing Secret** (`whsec_...`) and add it to your Vercel Environment Variables as `STRIPE_WEBHOOK_SECRET`.
5.  **Redeploy** Vercel if you added this variable late.

## 6. Verify

1.  Visit your Vercel URL.
2.  Sign up with a new user.
3.  Try "Create Lesson" -> "AI Generate".
4.  Go to "Pricing" -> "Upgrade" (Test Mode) -> Verify success redirect.

**Done!** Your SaaS is live.
