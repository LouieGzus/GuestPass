
-- GuestPass: Organization and membership foundation
-- Migration: 20261013000100

begin;

-- 1. Organizations
create table public.organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null check (char_length(trim(name)) between 2 and 150),
    organization_type text not null default 'individual'
        check (
            organization_type in (
                'individual',
                'event_company',
                'business',
                'school',
                'church',
                'government',
                'nonprofit',
                'other'
            )
        ),
    created_by uuid not null references auth.users(id) on delete restrict,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. Organization memberships and roles
create table public.organization_memberships (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references public.organizations(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'viewer'
        check (
            role in (
                'owner',
                'admin',
                'event_manager',
                'registration_staff',
                'viewer'
            )
        ),
    created_at timestamptz not null default now(),
    unique (organization_id, user_id)
);

create index organization_memberships_user_idx
    on public.organization_memberships(user_id);

create index organization_memberships_org_idx
    on public.organization_memberships(organization_id);

-- 3. Security helpers
-- SECURITY DEFINER avoids recursive membership-table RLS checks.
create or replace function public.is_org_member(
    target_org_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.organization_memberships m
        where m.organization_id = target_org_id
          and m.user_id = (select auth.uid())
    );
$$;

create or replace function public.has_org_role(
    target_org_id uuid,
    allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.organization_memberships m
        where m.organization_id = target_org_id
          and m.user_id = (select auth.uid())
          and m.role = any(allowed_roles)
    );
$$;

revoke all on function public.is_org_member(uuid) from public;
revoke all on function public.has_org_role(uuid, text[]) from public;

grant execute on function public.is_org_member(uuid) to authenticated;
grant execute on function public.has_org_role(uuid, text[]) to authenticated;

-- 4. Enable row-level security
alter table public.organizations enable row level security;
alter table public.organization_memberships enable row level security;

-- 5. Organization policies
create policy "Members can view their organizations"
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

create policy "Authenticated users can create organizations"
on public.organizations
for insert
to authenticated
with check (created_by = (select auth.uid()));

create policy "Owners and admins can update organizations"
on public.organizations
for update
to authenticated
using (
    public.has_org_role(id, array['owner', 'admin']::text[])
)
with check (
    public.has_org_role(id, array['owner', 'admin']::text[])
);

-- 6. Membership policies
create policy "Members can view organization memberships"
on public.organization_memberships
for select
to authenticated
using (public.is_org_member(organization_id));

-- The creator can add themselves as the initial owner.
-- Existing owners/admins can subsequently manage memberships.
create policy "Owners can add initial membership and admins can manage"
on public.organization_memberships
for insert
to authenticated
with check (
    (
        user_id = (select auth.uid())
        and role = 'owner'
        and exists (
            select 1
            from public.organizations o
            where o.id = organization_id
              and o.created_by = (select auth.uid())
        )
    )
    or public.has_org_role(
        organization_id,
        array['owner', 'admin']::text[]
    )
);

create policy "Owners and admins can update memberships"
on public.organization_memberships
for update
to authenticated
using (
    public.has_org_role(
        organization_id,
        array['owner', 'admin']::text[]
    )
)
with check (
    public.has_org_role(
        organization_id,
        array['owner', 'admin']::text[]
    )
);

create policy "Owners and admins can remove memberships"
on public.organization_memberships
for delete
to authenticated
using (
    public.has_org_role(
        organization_id,
        array['owner', 'admin']::text[]
    )
);

-- Do not grant table access to anonymous users.
grant select, insert, update
on public.organizations to authenticated;

grant select, insert, update, delete
on public.organization_memberships to authenticated;

commit;
