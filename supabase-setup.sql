-- Run this in your Supabase SQL editor

create table public.coupons (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  store_name text not null,
  code text,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'gift_card')),
  original_value numeric not null,
  remaining_value numeric not null,
  currency text default 'ILS',
  category text,
  expiry_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.coupons enable row level security;

create policy "Users can view their own coupons"
  on public.coupons for select
  using (auth.uid() = user_id);

create policy "Users can insert their own coupons"
  on public.coupons for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own coupons"
  on public.coupons for update
  using (auth.uid() = user_id);

create policy "Users can delete their own coupons"
  on public.coupons for delete
  using (auth.uid() = user_id);
