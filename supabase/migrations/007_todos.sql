create table todos (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users not null,
  title       text not null,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table todos enable row level security;

create policy "users own todos" on todos
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
