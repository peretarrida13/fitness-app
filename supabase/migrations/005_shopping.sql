-- Checked state for default items (key = "Category-index")
create table shopping_checks (
  user_id uuid references profiles(id) on delete cascade,
  item_key text not null check (char_length(item_key) <= 60),
  primary key (user_id, item_key)
);
alter table shopping_checks enable row level security;
create policy "self" on shopping_checks
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User-added custom items
create table shopping_custom_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade not null,
  name        text not null check (char_length(name) between 1 and 100),
  qty         text not null default '',
  category    text not null default 'My Items',
  checked     boolean not null default false,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);
alter table shopping_custom_items enable row level security;
create policy "self" on shopping_custom_items
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
