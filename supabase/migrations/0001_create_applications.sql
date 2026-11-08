-- =============================================================================
-- Başvuru Takip: veritabanı şeması
-- Supabase panelinde SQL Editor'e yapıştırıp "Run" ile çalıştır.
-- =============================================================================

create table if not exists public.applications (
  id          uuid primary key default gen_random_uuid(),
  -- Kayıt eklenirken user_id gönderilmez; oturumdaki kullanıcı otomatik atanır
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,

  company     text not null check (char_length(company) between 1 and 100),
  position    text not null check (char_length(position) between 1 and 100),
  location    text not null default '',
  work_type   text not null default 'hybrid'
              check (work_type in ('onsite', 'hybrid', 'remote')),
  status      text not null default 'applied'
              check (status in ('wishlist', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  applied_at  date,
  job_url     text not null default '',
  source      text not null default '',
  salary_min  integer check (salary_min >= 0),
  salary_max  integer check (salary_max >= 0),
  currency    text not null default 'TRY' check (currency in ('TRY', 'USD', 'EUR')),
  notes       text not null default '',
  -- Mülakatlar başvuruyla birlikte okunup yazıldığı için JSON olarak tutuluyor.
  -- Mülakatlar üzerinde ayrı sorgular gerekirse ayrı bir tabloya taşınabilir.
  interviews  jsonb not null default '[]'::jsonb check (jsonb_typeof(interviews) = 'array'),

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint salary_range_valid check (salary_min is null or salary_max is null or salary_max >= salary_min)
);

create index if not exists applications_user_id_updated_at_idx
  on public.applications (user_id, updated_at desc);

-- updated_at alanını her güncellemede otomatik yenile -------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists applications_set_updated_at on public.applications;
create trigger applications_set_updated_at
  before update on public.applications
  for each row execute function public.set_updated_at();

-- Row Level Security (RLS) ----------------------------------------------------
-- RLS açıkken, aşağıdaki politikalara uymayan hiçbir satır okunamaz ve
-- değiştirilemez. Tarayıcıdaki "publishable" anahtar herkese açık olduğu için
-- verinin güvenliği tamamen bu kurallara bağlı: her kullanıcı sadece kendi
-- başvurularını görebilir ve değiştirebilir.
alter table public.applications enable row level security;

drop policy if exists "Kullanıcılar kendi başvurularını görür" on public.applications;
create policy "Kullanıcılar kendi başvurularını görür"
  on public.applications for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Kullanıcılar kendi adına başvuru ekler" on public.applications;
create policy "Kullanıcılar kendi adına başvuru ekler"
  on public.applications for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Kullanıcılar kendi başvurularını günceller" on public.applications;
create policy "Kullanıcılar kendi başvurularını günceller"
  on public.applications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Kullanıcılar kendi başvurularını siler" on public.applications;
create policy "Kullanıcılar kendi başvurularını siler"
  on public.applications for delete
  to authenticated
  using ((select auth.uid()) = user_id);
