-- Idempotent trigger to sync auth.users -> public.user_profiles

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (auth_user_id, email, name, role, tenant_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name',''),
    coalesce(new.raw_user_meta_data->>'role', 'viewer'),
    null
  )
  on conflict (auth_user_id)
  do update set
    email = excluded.email,
    name = excluded.name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();
