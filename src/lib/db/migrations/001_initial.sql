-- PostgreSQL 14+; apply through npm run db:migrate to a new database.


create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
  'archived'
);

create type intake_status as enum (
  'submitted',
  'reviewing',
  'needs_information',
  'approved_for_scoping',
  'closed'
);

create type project_request_status as enum (
  'submitted',
  'reviewing',
  'scoping',
  'proposal_sent',
  'approved',
  'declined',
  'closed'
);

create type talent_application_status as enum (
  'submitted',
  'screening',
  'interview',
  'bench',
  'hired',
  'declined',
  'archived'
);

create type admin_role as enum ('owner', 'admin', 'manager', 'viewer');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  region text,
  service_interest text,
  source text not null default 'contact',
  status lead_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_intakes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  company_name text not null,
  website text,
  region text not null,
  services_needed text[] not null default '{}',
  monthly_volume text,
  current_tools text,
  workflow_summary text not null,
  desired_start_date date,
  status intake_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  project_type text not null,
  company_name text not null,
  contact_email text not null,
  budget_range text,
  timeline text,
  current_tools text,
  requirements_summary text not null,
  status project_request_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.talent_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  country text,
  role_interest text not null,
  experience_level text,
  portfolio_url text,
  availability text,
  experience_summary text,
  status talent_application_status not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  role admin_role not null default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.client_intakes enable row level security;
alter table public.project_requests enable row level security;
alter table public.talent_applications enable row level security;
alter table public.admin_users enable row level security;

create index leads_status_idx on public.leads(status);
create index client_intakes_status_idx on public.client_intakes(status);
create index project_requests_status_idx on public.project_requests(status);
create index talent_applications_status_idx on public.talent_applications(status);

alter table public.client_intakes
  add column if not exists workflow_summary text;

alter table public.project_requests
  add column if not exists current_tools text;

alter table public.talent_applications
  add column if not exists experience_summary text;



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
create index if not exists seo_audits_audit_date_idx on public.seo_audits(audit_date desc);
create index if not exists seo_issues_severity_idx on public.seo_issues(severity);
create index if not exists keyword_opportunities_status_idx on public.keyword_opportunities(status);
create index if not exists content_recommendations_status_idx on public.content_recommendations(status);
create index if not exists indexed_urls_status_idx on public.indexed_urls(status);
create index if not exists website_alerts_status_idx on public.website_alerts(status);
create index if not exists website_alerts_severity_idx on public.website_alerts(severity);



create table if not exists public.investor_deck_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  event_name text not null check (
    event_name in (
      'investor_deck_page_view',
      'investor_deck_started',
      'investor_deck_slide_viewed',
      'investor_deck_halfway_reached',
      'investor_deck_completed',
      'investor_deck_pdf_downloaded',
      'investor_deck_contact_clicked',
      'investor_deck_fullscreen_opened',
      'investor_deck_autoplay_started'
    )
  ),
  slide_number integer check (slide_number between 1 and 15),
  referrer text,
  user_agent_category text check (user_agent_category in ('desktop', 'mobile', 'tablet')),
  created_at timestamptz not null default now()
);

alter table public.investor_deck_events enable row level security;

create index if not exists investor_deck_events_created_at_idx
  on public.investor_deck_events(created_at desc);

create index if not exists investor_deck_events_event_name_idx
  on public.investor_deck_events(event_name);

create index if not exists investor_deck_events_session_id_idx
  on public.investor_deck_events(session_id);

create index if not exists investor_deck_events_slide_number_idx
  on public.investor_deck_events(slide_number)
  where slide_number is not null;



create table if not exists public.whitepaper_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  event_name text not null check (
    event_name in (
      'whitepaper_page_view',
      'whitepaper_started',
      'whitepaper_page_viewed',
      'whitepaper_halfway_reached',
      'whitepaper_completed',
      'whitepaper_pdf_downloaded',
      'whitepaper_contact_clicked',
      'whitepaper_fullscreen_opened',
      'whitepaper_view_mode_changed'
    )
  ),
  page_number integer check (page_number between 1 and 17),
  referrer text,
  user_agent_category text check (user_agent_category in ('desktop', 'mobile', 'tablet')),
  created_at timestamptz not null default now()
);

alter table public.whitepaper_events enable row level security;

create index if not exists whitepaper_events_created_at_idx
  on public.whitepaper_events(created_at desc);

create index if not exists whitepaper_events_event_name_idx
  on public.whitepaper_events(event_name);

create index if not exists whitepaper_events_session_id_idx
  on public.whitepaper_events(session_id);

create index if not exists whitepaper_events_page_number_idx
  on public.whitepaper_events(page_number)
  where page_number is not null;
