
-- Tables
create table public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_url text,
  link text,
  video_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category text,
  description text,
  image_url text,
  product_url text,
  specs jsonb default '{}'::jsonb,
  rating text,
  featured boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.specs (
  id uuid primary key default gen_random_uuid(),
  game_name text not null,
  game_image text,
  data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  website_url text,
  coupon_code text,
  discount_text text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.steam_games (
  id uuid primary key default gen_random_uuid(),
  app_id text,
  name text not null,
  image_url text,
  hours_played text,
  achievements_earned int,
  achievements_total int,
  featured boolean default false,
  created_at timestamptz not null default now()
);

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  name text,
  created_at timestamptz not null default now()
);

create table public.socials (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into public.socials (id, data) values (1, '{}'::jsonb);

create table public.site_content (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.portfolio enable row level security;
alter table public.products enable row level security;
alter table public.specs enable row level security;
alter table public.sponsors enable row level security;
alter table public.steam_games enable row level security;
alter table public.gallery enable row level security;
alter table public.socials enable row level security;
alter table public.site_content enable row level security;

-- Public read policies (no writes — writes go through edge function with service role)
create policy "public read" on public.portfolio for select using (true);
create policy "public read" on public.products for select using (true);
create policy "public read" on public.specs for select using (true);
create policy "public read" on public.sponsors for select using (true);
create policy "public read" on public.steam_games for select using (true);
create policy "public read" on public.gallery for select using (true);
create policy "public read" on public.socials for select using (true);
create policy "public read" on public.site_content for select using (true);

-- Storage bucket for media (public read)
insert into storage.buckets (id, name, public) values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public read media" on storage.objects for select using (bucket_id = 'media');
