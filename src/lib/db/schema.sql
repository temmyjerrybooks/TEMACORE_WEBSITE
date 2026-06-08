create extension if not exists "pgcrypto";

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
