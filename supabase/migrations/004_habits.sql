-- Run in Supabase SQL Editor after 003_activities.sql

create table public.habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 100),
  icon       text not null default '✅',
  color      text not null default '--accent'
             check (color in ('--accent','--green','--gold','--red','--text2')),
  sort_order int  not null default 0,
  created_at timestamptz default now() not null
);

alter table public.habits enable row level security;
create policy "habits: select own" on public.habits for select using (auth.uid() = user_id);
create policy "habits: insert own" on public.habits for insert with check (auth.uid() = user_id);
create policy "habits: update own" on public.habits for update using (auth.uid() = user_id);
create policy "habits: delete own" on public.habits for delete using (auth.uid() = user_id);

create table public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  habit_id    uuid not null references public.habits(id) on delete cascade,
  logged_date date not null,
  created_at  timestamptz default now() not null,
  unique(user_id, habit_id, logged_date)
);

alter table public.habit_logs enable row level security;
create policy "habit_logs: select own" on public.habit_logs for select using (auth.uid() = user_id);
create policy "habit_logs: insert own" on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "habit_logs: delete own" on public.habit_logs for delete using (auth.uid() = user_id);

create index habit_logs_user_date on public.habit_logs(user_id, logged_date);
