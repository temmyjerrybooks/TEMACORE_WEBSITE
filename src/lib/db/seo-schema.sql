create extension if not exists "pgcrypto";

create table if not exists public.seo_audits (
  id uuid primary key default gen_random_uuid(),
  audit_date timestamptz not null default now(),
  overall_score integer not null default 0,
  pages_checked integer not null default 0,
  issues_found integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_issues (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.seo_audits(id) on delete cascade,
  page_url text not null,
  issue_type text not null,
  issue_message text not null,
  severity text not null default 'Medium' check (severity in ('Low', 'Medium', 'High', 'Critical')),
  status text not null default 'New' check (status in ('New', 'In Review', 'In Progress', 'Fixed', 'Ignored')),
  created_at timestamptz not null default now()
);

create table if not exists public.keyword_opportunities (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  target_page text not null,
  search_intent text not null,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High', 'Critical')),
  recommendation text not null,
  status text not null default 'New' check (status in ('New', 'In Review', 'In Progress', 'Fixed', 'Ignored')),
  created_at timestamptz not null default now()
);

create table if not exists public.content_recommendations (
  id uuid primary key default gen_random_uuid(),
  page_url text not null,
  recommendation_type text not null,
  title text not null,
  description text not null,
  status text not null default 'New' check (status in ('New', 'In Review', 'In Progress', 'Fixed', 'Ignored')),
  created_at timestamptz not null default now()
);

create table if not exists public.indexed_urls (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  source text not null,
  status text not null default 'New' check (status in ('New', 'In Review', 'In Progress', 'Fixed', 'Ignored')),
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.website_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_type text not null,
  message text not null,
  severity text not null default 'Medium' check (severity in ('Low', 'Medium', 'High', 'Critical')),
  status text not null default 'New' check (status in ('New', 'In Review', 'In Progress', 'Fixed', 'Ignored')),
  created_at timestamptz not null default now()
);

alter table public.seo_audits enable row level security;
alter table public.seo_issues enable row level security;
alter table public.keyword_opportunities enable row level security;
alter table public.content_recommendations enable row level security;
alter table public.indexed_urls enable row level security;
alter table public.website_alerts enable row level security;

create index if not exists seo_issues_audit_id_idx on public.seo_issues(audit_id);
create index if not exists seo_issues_status_idx on public.seo_issues(status);
create index if not exists keyword_opportunities_status_idx on public.keyword_opportunities(status);
create index if not exists content_recommendations_status_idx on public.content_recommendations(status);
create index if not exists indexed_urls_status_idx on public.indexed_urls(status);
create index if not exists website_alerts_status_idx on public.website_alerts(status);
