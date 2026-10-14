
-- GuestPass: Atomically create an organization and its initial owner.

begin;

create or replace function public.create_organization(
    organization_name text,
    organization_type text default 'individual'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    new_org_id uuid;
    current_user_id uuid;
begin
    current_user_id := auth.uid();

    if current_user_id is null then
        raise exception 'Authentication required';
    end if;

    if organization_name is null
       or char_length(trim(organization_name)) < 2
       or char_length(trim(organization_name)) > 150 then
        raise exception 'Organization name must be between 2 and 150 characters';
    end if;

    if organization_type not in (
        'individual',
        'event_company',
        'business',
        'school',
        'church',
        'government',
        'nonprofit',
        'other'
    ) then
        raise exception 'Invalid organization type';
    end if;

    insert into public.organizations (
        name,
        organization_type,
        created_by
    )
    values (
        trim(organization_name),
        organization_type,
        current_user_id
    )
    returning id into new_org_id;

    insert into public.organization_memberships (
        organization_id,
        user_id,
        role
    )
    values (
        new_org_id,
        current_user_id,
        'owner'
    );

    return new_org_id;
end;
$$;

revoke all on function public.create_organization(text, text)
from public, anon;

grant execute on function public.create_organization(text, text)
to authenticated;

commit;
