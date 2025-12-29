# Database Schema (Prisma)

## Datasource
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## Models

### User
Stores user identity and subscription status.

```prisma
model User {
  id               String        @id @default(uuid()) // or link to auth.users id
  email            String        @unique
  stripeCustomerId String?
  subscriptionTier SubscriptionTier @default(FREE)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  lessons          LessonPlan[]
  subscription     Subscription?
}

enum SubscriptionTier {
  FREE
  PRO
}
```

### LessonPlan
Core entity for the lesson planning feature.

```prisma
model LessonPlan {
  id          String   @id @default(uuid())
  title       String
  date        DateTime
  duration    Int      // Duration in minutes
  contentJson Json     // Stores the structured lesson content (blocks, activity, etc.)
  standards   String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Subscription
Tracks Stripe subscription details.

```prisma
model Subscription {
  id               String   @id @default(uuid())
  status           String   // e.g., 'active', 'past_due'
  currentPeriodEnd DateTime
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```
