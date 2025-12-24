# PlanFlow Deployment Guide

Congratulations on completing the MVP! Follow these steps to deploy PlanFlow to production.

## 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Link your local project to GitHub and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"New Project"**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add the following from your local `.env` file:
   - `DATABASE_URL`: (Your Supabase/Prisma connection string)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`: (Get this in step 3)
   - `NEXT_PUBLIC_APP_URL`: `https://your-vercel-domain.vercel.app`
5. Click **Deploy**.

## 3. Configure Stripe Webhooks
To handle payments and subscription updates in production:
1. Go to the [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **"Add endpoint"**.
3. **Endpoint URL**: `https://your-vercel-domain.vercel.app/api/stripe/webhook`
4. **Select events**:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
5. Copy the **Signing secret** (`whsec_...`) and add it as `STRIPE_WEBHOOK_SECRET` in your Vercel Project Settings.

## 4. Final Database Sync
Since you are using Prisma, ensure your production database is up to date:
Vercel will automatically run your build, but you may need to ensure the schema is applied. You can add a `postinstall` script to `package.json` if needed, or run it manually:
```bash
npx prisma db push
```

## 5. Supabase Auth Configuration
In your Supabase Dashboard:
1. Go to **Authentication > URL Configuration**.
2. Set **Site URL** to `https://your-vercel-domain.vercel.app`.
3. Add `https://your-vercel-domain.vercel.app/auth/callback` to the **Redirect URLs**.

---
**Note:** Ensure your Stripe Redirect URLs in `/api/stripe/checkout/route.ts` are using `process.env.NEXT_PUBLIC_APP_URL` to point to the correct domain in production.
