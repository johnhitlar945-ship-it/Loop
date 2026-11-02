-- Run this whole file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  category text not null,
  source_name text not null,
  source_url text not null unique,
  status text not null default 'draft' check (status in ('draft','published','rejected')),
  ai_generated boolean not null default true,
  created_at timestamptz not null default now(),
  published_at timestamptz
);

alter table public.stories enable row level security;

-- Public visitors may only read published stories.
drop policy if exists "Public can read published stories" on public.stories;
create policy "Public can read published stories"
on public.stories for select to anon, authenticated
using (status = 'published');

-- Do not add public insert/update/delete policies. Server routes use the service-role key.
grant select on public.stories to anon, authenticated;
