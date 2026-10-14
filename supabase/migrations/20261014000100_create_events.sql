
-- GuestPass: Event management foundation
-- Migration: 20261014000100

begin;

create table public.events (
    id uuid primary key default gen_random_uuid(),

    organization_id uuid not null
        references public.organizations(id) on delete cascade,

    name text not null
        check (char_length(trim(name)) between 2 and 180),

    event_type text not null default 'other'
        check (
            event_type in (
                'wedding',
                'birthday',
                'corporate',
                'conference',
                'graduation',
                'religious',
                'government',
                'cultural',
                'private',
                'other'
            )
        ),

    description text
        check (description is null or char_length(description) <= 5000),

    venue text
        check (venue is null or char_length(venue) <= 300),

    starts_at timestamptz not null,
    ends_at timestamptz not null,

    timezone text not null default 'Africa/Johannesburg',

    status text not null default 'draft'
        check (
            status in (
                'draft',
                'published',
                'completed',
                'cancelled'
            )
        ),

    created_by uuid not null
        references auth.users(id) on delete restrict,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint events_valid_schedule check (ends_at > starts_at)
);

create index events_organization_idx
    on public.events(organization_id);

create index events_organization_start_idx
    on public.events(organization_id, starts_at);

create index events_status_idx
    on public.events(organization_id, status);

alter table public.events enable row level security;

-- Members can view events belonging to their organizations.
create policy "Organization members can view events"
on public.events
for select
to authenticated
using (
    public.is_org_member(organization_id)
);

-- Owners, admins and event managers can create events.
create policy "Authorized members can create events"
on public.events
for insert
to authenticated
with check (
    created_by = (select auth.uid())
    and public.has_org_role(
        organization_id,
        array['owner', 'admin', 'event_manager']::text[]
    )
);

-- Owners, admins and event managers can update events.
create policy "Authorized members can update events"
on public.events
for update
to authenticated
using (
    public.has_org_role(
        organization_id,
        array['owner', 'admin', 'event_manager']::text[]
    )
)
with check (
    public.has_org_role(
        organization_id,
        array['owner', 'admin', 'event_manager']::text[]
    )
);

-- Only owners and admins can delete events.
create policy "Organization owners and admins can delete events"
on public.events
for delete
to authenticated
using (
    public.has_org_role(
        organization_id,
        array['owner', 'admin']::text[]
    )
);

grant select, insert, update, delete
on public.events to authenticated;

commit;
