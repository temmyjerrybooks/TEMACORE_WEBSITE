create extension if not exists "pgcrypto";

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
