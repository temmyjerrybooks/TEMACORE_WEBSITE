alter table public.client_intakes
  add column if not exists workflow_summary text;

alter table public.project_requests
  add column if not exists current_tools text;

alter table public.talent_applications
  add column if not exists experience_summary text;
