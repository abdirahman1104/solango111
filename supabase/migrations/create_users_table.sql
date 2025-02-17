-- Create users table
create table if not exists public.users (
    id text primary key,
    email text unique not null,
    name text,
    image text,
    provider text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to read their own data
create policy "Users can view own profile" 
    on public.users for select 
    using ( auth.uid() = id );

-- Create policy to allow the application to insert new users
create policy "Application can create users" 
    on public.users for insert 
    with check ( true );

-- Create function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger on_user_updated
    before update on public.users
    for each row
    execute procedure public.handle_updated_at();
