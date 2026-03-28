# Christian Study Guide - Setup & Deployment Guide

## What's Been Built ✅

This implementation covers **Phase 1 MVP** of the Christian Study Guide platform with the following features:

### Core Features Implemented:

1. **Database Schema** - Full Supabase PostgreSQL setup with RLS policies
2. **Authentication** - Sign up, sign in, password reset flows
3. **Bible Reader** - Clean, responsive passage display with translation selector
4. **Notes & Highlights** - Save, edit, delete, and tag notes per passage
5. **Bookmarks** - Quick save/manage favorite passages
6. **Reading Streaks** - Track daily reading habits
7. **Reading Plans** - 8 curated Bible reading plans with progress tracking
8. **User Profile** - Account management and statistics dashboard
9. **Study Persistence** - All user data synced to Supabase

---

## 🚀 Deployment Steps

### Step 1: Deploy Database Migrations

Run the SQL migrations in your Supabase dashboard:

1. Go to **Supabase Dashboard → SQL Editor**
2. Create a new query
3. Copy and paste the contents of:
   - `migrations/001_initial_schema.sql` (tables + RLS policies)
   - `migrations/002_seed_reading_plans.sql` (sample reading plans)
4. Execute both queries

This will create all tables with proper security policies.

### Step 2: Verify Authentication

Test signup/signin:

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000/auth/signup
# Create a test account
# Should redirect to /account dashboard
```

### Step 3: Test Core Features

**Bible Reading:**

- Go to homepage, search "John 3"
- Should load passage in all 3 translations
- Click bookmark button (requires login)
- Should add to bookmarks

**Notes System:**

- On any passage, click "Open Notes Panel"
- Add a note, highlight, or question
- Should save to database immediately
- Try filters and editing

**Reading Streaks:**

- Visit `/account`
- Should see streak counters
- Read a passage → streak updates next day

**Reading Plans:**

- Visit `/reading-plans`
- Click "Start Plan" on any plan
- Should show progress tracking
- Click "Today's Reading" to go to passage

---

## 📁 File Structure

### APIs Created:

```
app/api/
├── auth/
│   └── signup/route.ts          (User registration)
├── profile/route.ts             (User profile management)
├── notes/route.ts               (CRUD notes)
├── bookmarks/route.ts           (Save/manage bookmarks)
├── studies/route.ts             (Log reading & streak tracking)
└── reading-plans/
    ├── route.ts                 (List & enroll plans)
    └── [id]/route.ts            (Update progress, unenroll)
```

### Pages Created:

```
app/
├── auth/
│   ├── signup/page.tsx          (Registration form)
│   └── signin/page.tsx          (Login form)
├── account/page.tsx             (User dashboard & profile)
├── passage/[reference]/page.tsx (Bible reader - refactored)
└── reading-plans/page.tsx       (Plans discovery & management)
```

### Components Created:

```
components/
├── NotesPanel.tsx               (Notes sidebar for passages)
└── ... (existing components)
```

### Libraries Created:

```
lib/
├── persistence.ts               (API helper functions)
├── auth.ts                      (Auth utilities)
└── types/
    └── database.ts              (TypeScript types for DB)
```

---

## 🔐 Security Features

### Row-Level Security (RLS) Enabled:

- ✅ Users can only see their own notes
- ✅ Users can only see their own bookmarks
- ✅ Users can only see their own reading progress
- ✅ Prayer requests have public/private controls
- ✅ Study groups have privacy settings

### Authentication:

- ✅ Email/password authentication via Supabase
- ✅ Session tokens stored securely
- ✅ Password reset flow implemented
- ✅ Account deletion (cascades all user data)

---

## 📊 Database Schema Overview

### Core Tables:

- `user_profiles` - Extended user data
- `user_studies` - Reading history
- `user_notes` - Notes with tags
- `user_bookmarks` - Saved passages
- `user_streaks` - Daily reading streaks
- `reading_plans` - Curated reading schedules
- `user_reading_plans` - User progress on plans
- `user_journals` - Devotional entries
- `ai_conversations` - AI mentor history
- `study_groups` - Community groups
- `prayer_requests` - Prayer board

---

## 🛣️ What's Next (Phase 2 & Beyond)

### Phase 2: Learning Core

- [ ] Journal entries (prayer, devotional, reflection)
- [ ] Verse memorization system
- [ ] Quiz/knowledge checks
- [ ] Improved reflection questions

### Phase 3: AI & Personalization

- [ ] AI Bible Tutor (via OpenAI/Claude API)
- [ ] Smart recommendations
- [ ] Content generation (sermon outlines)
- [ ] Personalized learning paths

### Phase 4: Community

- [ ] Study groups & shared notes
- [ ] Prayer board/requests
- [ ] Social sharing
- [ ] Church integration

### Phase 5: Premium Features

- [ ] 3D Bible world exploration
- [ ] Interactive maps & timelines
- [ ] Original language tools
- [ ] Knowledge graphs

---

## 🧪 Testing Checklist

- [ ] Sign up new account
- [ ] Sign in returning user
- [ ] Read a Bible passage
- [ ] Switch translations
- [ ] Add/edit/delete note
- [ ] Bookmark a passage
- [ ] Check reading streak updates
- [ ] Start a reading plan
- [ ] Track plan progress
- [ ] View account dashboard
- [ ] Check user statistics

---

## ⚠️ Important Configuration

### Supabase:

1. Ensure you have the correct `.env.local` with Supabase keys
2. Auth should be enabled in your project
3. Database should be in `public` schema

### Email:

- Password reset uses Supabase email service
- Verify correct email templates in Supabase dashboard

### Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (server-side only)
```

---

## 🐛 Troubleshooting

**Auth not working:**

- Check Supabase project is active
- Verify email/password correct in `.env.local`
- Check RLS policies aren't blocking access

**Notes not saving:**

- Ensure user is logged in
- Check browser network tab for API errors
- Verify RLS policy allows insert

**Reading streaks not updating:**

- Streaks show next day (logic prevents same-day doubling)
- Click homepage and refresh to test
- Check `/api/studies` returns streak data

**Reading plans not loading:**

- Ensure seed data was inserted via SQL migration
- Check plans table has entries: `SELECT COUNT(*) FROM reading_plans;`
- Verify user is authenticated

---

## 📞 Support

For issues or feature requests, refer to:

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

---

## 📈 Metrics & Analytics

Track user engagement:

- View `user_studies` table for reading history
- Check `user_streaks` for engagement trends
- Analyze `user_activity` table for feature usage
- Monitor `ai_conversations` for AI feature adoption

---

**Version:** 1.0.0 (Phase 1 MVP)  
**Last Updated:** March 2026
