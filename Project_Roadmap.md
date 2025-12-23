# Project Roadmap: PlanFlow

## Overview
PlanFlow is a Micro-SaaS lesson planner featuring a drag-and-drop calendar and AI-powered lesson generation.

## 1. Foundation (Current Phase)
- [x] Initialize Next.js 15 Project (App Router, TypeScript)
- [x] Tailwind CSS Configuration
- [x] Install Shadcn/UI Core
- [x] Add Essential Components: `button`, `calendar`, `dialog`, `card`, `sheet`
- [x] Infrastructure Setup: Prisma ORM & Database Schema creation

## 2. Authentication & Database
- [x] Supabase Project Configuration
- [x] Next.js Auth Helpers Integration
- [x] Database Migration (Push Schema to Supabase)
- [x] Middleware for Route Protection (`/dashboard`)
- [x] Row Level Security (RLS) Policies

## 3. Core Features: Calendar & Lesson Management
- [x] `/dashboard` Page Skeleton
- [x] Weekly Calendar Grid Component
- [x] Lesson Card Component (Draggable)
- [x] `CreateLessonModal` Feature
- [x] Drag-and-Drop Implementation (`dnd-kit`)
- [x] Slide-over Editor for Lesson Details (Implemented as Modal)

## 4. AI Integration ("The Brain")
- [x] Vercel AI SDK Integration
- [x] API Route: `/api/generate-lesson`
- [x] AI prompt Engineering (JSON Schema enforcement)
- [x] Streaming Responsess to UI Cards
- [x] "Generate Resources" & "Modify for IEP" Action Buttons (Consolidated into Details view)

## 5. Payments & Polish
- [x] Stripe Checkout Integration
- [x] Subscription Management Logic
- [x] UI Polish (Animations, Transitions, Loading States)
- [x] SEO Optimization (Metadata, Semantic HTML)

## 6. Personalization & Mobile (Enhanced UX)
- [x] Lesson Start Times (Support for multiple lessons per day)
- [x] Tabbed Authentication Flow (Unified Login/Register)
- [x] Forgot Password Recovery Flow
- [x] Responsive Mobile Navigation (Sheet-based sidebar)
- [x] User Profile Center (Name updates & Usage tracking)
- [x] Theme Management (Light, Dark, and Midnight Sky)
