create extension if not exists "pgcrypto";

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
