# FitTracker — Web App

React 19 + TypeScript + Vite + Tailwind CSS + Supabase. Deployed to Netlify.

## Commands

```bash
npm run dev          # dev server → http://localhost:5173
npm run build        # tsc -b && vite build
npm run lint         # ESLint 10
npm run preview      # preview production build
```

## Tech stack

| Library | Version | Role |
|---|---|---|
| React | 19 | UI |
| TypeScript | ~6.0 | Type safety |
| Vite | 8 | Bundler/dev server |
| Tailwind CSS | 4 | Utility CSS (Vite plugin, no config file needed) |
| React Router DOM | 7 | Client-side routing |
| TanStack React Query | 5 | Server state (Supabase data) |
| Zustand | 5 | Client state (UI/local) |
| Supabase JS | 2 | Auth + database |
| Radix UI | latest | Accessible primitives (dialog, checkbox, select, tabs, etc.) |
| Recharts | 3 | Charts in Progress page |
| Lucide React | latest | Icons |

Path alias: `@` → `./src` (configured in `vite.config.ts` and `tsconfig.app.json`)

## Directory structure

```
src/
  App.tsx                    # Root: providers + BrowserRouter + routes
  main.tsx                   # createRoot entry
  index.css                  # CSS variables (design tokens) + global resets
  assets/                    # Static assets (images)
  components/
    auth/                    # AuthGate (magic link flow), PasswordGate
    calendar/                # Google Calendar integration + weekly view
    gym/                     # GymPage, ExerciseCard, MuscleMap
    habits/                  # HabitsPage + tabs/ (TodayTab, TomorrowTab, WeekTab)
    home/                    # HomePage (daily dashboard — web only)
    layout/                  # AppShell (Outlet + BottomNav), BottomNav
    meals/                   # MealsPage, MealCard
    progress/                # ProgressPage + tabs/ (Weight, Workouts, PRs, Body, Health, Running)
    settings/                # SettingsPage (goals config — web only)
    shopping/                # ShoppingPage
    tips/                    # TipsPage
  hooks/
    useCalendarData.ts       # workout_logs, daily_activity, workout streak
    useGoogleCalendar.ts     # Google Calendar API calls
    useHabitData.ts          # habits CRUD + habit_logs + streaks
    useMealLogs.ts           # meal_logs for a given date
    useProgressData.ts       # weight_logs, measurements, personal_records, activities, health
    useShoppingData.ts       # shopping_checks + shopping_custom_items CRUD
  store/
    useAuthStore.ts          # Supabase session + magic link sign-in
    useCalendarStore.ts      # Google Calendar token (persisted)
    useExtrasStore.ts        # Off-plan extra kcal/protein per date (persisted)
    useSettingsStore.ts      # User goals: weight, calories, protein, steps, water (persisted)
    useShoppingStore.ts      # Legacy local shopping checks (persisted)
    useUIStore.ts            # Active day tabs for meals/gym
    useWaterStore.ts         # Daily water intake counter (persisted)
  types/
    gym.ts                   # GymDay, Exercise, ExerciseSection, DayType
    meals.ts                 # Meal plan types
    shopping.ts              # Shopping list types
    supabase.ts              # All DB row interfaces — extend this for new tables
  lib/
    supabase.ts              # createClient — single export: `supabase`
    dateUtils.ts             # toDateStr, getDayOfWeekIndex, getMondayOfWeek,
                             #   getWeekDays, formatWeekRange, isToday, getDayName
    utils.ts                 # cn() — clsx + tailwind-merge
    garmin.ts                # startGarminOAuth(), syncGarminData()
  data/
    defaultGym.ts            # GYM_DAYS static data (7 days)
    defaultMeals.ts          # DAYS static meal plan (7 days)
    defaultShopping.ts       # DEFAULT_SHOPPING_ITEMS static list
```

## Routes

| Path | Component | Notes |
|---|---|---|
| `/home` | `HomePage` | Default redirect, web-only |
| `/meals` | `MealsPage` | 7-day meal plan + logging |
| `/gym` | `GymPage` | Workout plan |
| `/progress` | `ProgressPage` | Charts: weight, workouts, PRs, body, health, running |
| `/shopping` | `ShoppingPage` | Checklist |
| `/tips` | `TipsPage` | Fitness tips |
| `/calendar` | `CalendarPage` | Google Calendar week view |
| `/habits` | `HabitsPage` | Habit tracker |
| `/settings` | `SettingsPage` | Goals, web-only |

## Design tokens (CSS variables, defined in `index.css`)

```css
--bg / --bg2 / --bg3       /* Background layers (darkest to slightly lighter) */
--card / --card2            /* Card surfaces */
--edge                      /* Card borders */
--accent / --accent2        /* Blue (#5b8dee / #7aa5f5) */
--accentbg / --accentbd     /* Accent fill / accent border (with opacity) */
--gold / --goldbg / --goldbd
--red / --redbg / --redbd
--green / --greenbg
--text / --text2 / --text3  /* Text hierarchy */
--border / --border2        /* Subtle borders (rgba white) */
--radius                    /* 14px (card corners) */
--radius-sm                 /* 9px (input/button corners) */
```

Typography: body = `Plus Jakarta Sans`, headings h1–h3 = `Space Grotesk`

## Component patterns

**IMPORTANT: all styling uses inline `style` objects with CSS variables — not Tailwind utility classes. Match this pattern in every component.**

### Page layout

```tsx
// Sticky header
<div style={{
  position: 'sticky', top: 0, zIndex: 10,
  background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)',
  borderBottom: '1px solid var(--border)', padding: '14px 16px 0',
}}>
  <h1 style={{
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 22, fontWeight: 700, color: 'var(--text)',
  }}>Page Title</h1>
</div>

// Scrollable content (96px bottom clears fixed BottomNav)
<div style={{ padding: '0 16px 96px' }}>
  {/* content */}
</div>
```

### Tab strip (for multi-view pages)

```tsx
type Tab = 'today' | 'week'
const [activeTab, setActiveTab] = useState<Tab>('today')

// Tab button
<button style={{
  flex: 1, padding: '8px 0',
  background: 'none', border: 'none',
  borderBottom: `2px solid ${activeTab === tab ? 'var(--accent)' : 'transparent'}`,
  color: activeTab === tab ? 'var(--accent)' : 'var(--text3)',
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
  transition: 'color 0.15s, border-color 0.15s',
}} />
```

### Card

```tsx
<div style={{
  background: 'var(--card)',
  border: '1px solid var(--edge)',
  borderRadius: 'var(--radius)',
  padding: '14px 16px',
}} />
```

### Form input

```tsx
<input style={{
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg2)', border: '1px solid var(--edge)',
  borderRadius: 'var(--radius-sm)', padding: '8px 10px',
  color: 'var(--text)', fontSize: 14, outline: 'none',
}} />
```

### Primary action button

```tsx
<button style={{
  padding: '9px 16px', background: 'var(--accent)',
  border: 'none', borderRadius: 'var(--radius-sm)',
  color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
}}>Save</button>
```

## Hook patterns (React Query + Supabase)

Every data hook:
1. Reads `user` from `useAuthStore` and passes `enabled: !!user`
2. Defines a `QK` object with typed const query key arrays
3. Throws errors rather than swallowing them
4. Invalidates affected query keys in mutation `onSuccess`

### Query template

```typescript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'

const QK = {
  all: ['my_table'] as const,
  byDate: (date: string) => ['my_table', date] as const,
}

export function useMyItems() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: QK.all,
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('my_table')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as MyType[]
    },
  })
}
```

### Mutation template

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useAddItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const { error } = await supabase.from('my_table').insert(payload)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.all }),
  })
}
```

### Upsert (one row per user per day)

```typescript
await supabase.from('my_table')
  .upsert(
    { logged_date: toDateStr(new Date()), ...payload },
    { onConflict: 'user_id,logged_date' }
  )
```

### Toggle (insert or delete, ignore duplicate)

```typescript
if (isActive) {
  await supabase.from('my_table').delete().eq('id', id)
} else {
  const { error } = await supabase.from('my_table').insert(...)
  if (error && error.code !== '23505') throw error  // ignore unique violation
}
```

## Store patterns (Zustand)

### Ephemeral (UI state — no persistence)

```typescript
import { create } from 'zustand'

interface MyState {
  value: string
  setValue: (v: string) => void
}

export const useMyStore = create<MyState>((set) => ({
  value: '',
  setValue: (v) => set({ value: v }),
}))
```

### Persisted (user preferences, counters)

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useMyStore = create<MyState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (v) => set({ value: v }),
    }),
    { name: 'jarvis-my-key' }  // unique localStorage key, prefix with 'jarvis-'
  )
)
```

Always consume stores with selector functions to prevent unnecessary re-renders:

```typescript
const value = useMyStore((s) => s.value)
```

## Type patterns

DB row interfaces → `src/types/supabase.ts` (always extend this file for new tables).
Feature-specific types (non-DB data structures) → `src/types/<feature>.ts`.

Use `import type` when the import is only used as a type:

```typescript
import type { WeightLog } from '@/types/supabase'
```

## Auth

- `PasswordGate` is the outermost wrapper — checks `VITE_APP_PASSWORD` first
- `AuthGate` shows magic-link form when `user` is null
- Auth state lives in `useAuthStore`, initialized via `init()` in `AuthGate`'s `useEffect`
- All Supabase queries must use `enabled: !!user` — otherwise they fire before auth resolves and fail RLS

## Supabase schema

All tables use RLS. All user data is scoped by `user_id = auth.uid()`.

Tables: `profiles`, `oauth_tokens`, `workout_logs`, `daily_activity`, `weight_logs`,
`measurements`, `personal_records`, `activities`, `habits`, `habit_logs`,
`shopping_checks`, `shopping_custom_items`, `meal_logs`

Date columns use the SQL `date` type. Always use `toDateStr()` from `@/lib/dateUtils` to generate
`YYYY-MM-DD` strings. Parse date strings back with `T12:00:00` suffix to avoid timezone shifts:

```typescript
new Date(dateStr + 'T12:00:00')
```

## Feature addition checklist

1. [ ] Create `src/types/<feature>.ts` with TypeScript interfaces matching the DB schema
2. [ ] Add SQL migration `supabase/migrations/00N_<feature>.sql` (table + RLS policies)
3. [ ] Create `src/hooks/use<Feature>Data.ts` with QK object + all queries/mutations
4. [ ] Create `src/components/<feature>/` directory
5. [ ] Create `src/components/<feature>/<Feature>Page.tsx`
6. [ ] Add route in `src/App.tsx`
7. [ ] Add nav item in `src/components/layout/BottomNav.tsx` (pick a Lucide icon)
8. [ ] If client-only state needed, create `src/store/use<Feature>Store.ts`
9. [ ] Run `npm run build` — fixes TypeScript errors before they become bugs
10. [ ] Run `npm run lint`

## Common pitfalls

- **Date off-by-one**: never use `new Date().toISOString()` for date comparisons; use `toDateStr()` and parse with `+ 'T12:00:00'`
- **Week indexing**: week days are Mon=0…Sun=6 via `getDayOfWeekIndex()` — not the JS default (Sun=0)
- **Missing auth guard**: `enabled: !!user` is required on every query or RLS will silently return empty data
- **Bottom padding**: page containers need `paddingBottom: 96` to clear the fixed BottomNav
- **BottomNav z-index**: fixed at `zIndex: 100`; sticky page headers use `zIndex: 10`
- **Inline styles, not Tailwind**: all existing components use CSS custom properties via inline `style` — do not switch to Tailwind class strings
- **QK invalidation scope**: when deleting a parent record, also invalidate child query keys (e.g., deleting a habit must also invalidate habit_logs)
- **staleTime for slow-changing data**: add `staleTime: 5 * 60_000` on queries that rarely change (habits, profiles) to avoid constant refetches on window focus
- **23505 on toggle**: when toggling a record that may already exist, check `error.code !== '23505'` before throwing
