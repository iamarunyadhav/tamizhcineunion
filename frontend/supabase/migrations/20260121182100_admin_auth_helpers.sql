-- Admin helper functions for bootstrap/login flows
create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.user_roles where role = 'admin');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.has_role(auth.uid(), 'admin'), false);
$$;

create or replace function public.bootstrap_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Only allow bootstrap when no admins exist
  if exists (select 1 from public.user_roles where role = 'admin') then
    return false;
  end if;

  insert into public.user_roles (user_id, role)
  values (auth.uid(), 'admin')
  on conflict (user_id, role) do nothing;

  return true;
end;
$$;

grant execute on function public.admin_exists to anon, authenticated;
grant execute on function public.is_admin to authenticated;
grant execute on function public.bootstrap_admin to authenticated;
