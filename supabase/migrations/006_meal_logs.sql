create table meal_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade not null,
  logged_date date not null,
  meal_id     text not null check (char_length(meal_id) <= 20),
  created_at  timestamptz not null default now(),
  unique (user_id, logged_date, meal_id)
);
alter table meal_logs enable row level security;
create policy "self" on meal_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
