-- Create api_keys table
create table if not exists public.api_keys (
    id uuid default gen_random_uuid() primary key,
    key_name text not null,
    api_key text unique not null,
    is_active boolean default true,
    user_id text references public.users(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.api_keys enable row level security;

-- Create policy to allow users to read their own API keys
create policy "Users can view own API keys" 
    on public.api_keys for select 
    using ( auth.uid() = user_id );

-- Create policy to allow users to create their own API keys
create policy "Users can create own API keys" 
    on public.api_keys for insert 
    with check ( auth.uid() = user_id );

-- Create policy to allow users to update their own API keys
create policy "Users can update own API keys" 
    on public.api_keys for update 
    using ( auth.uid() = user_id );

-- Create policy to allow users to delete their own API keys
create policy "Users can delete own API keys" 
    on public.api_keys for delete 
    using ( auth.uid() = user_id );

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at timestamp
create trigger handle_api_keys_updated_at
    before update on public.api_keys
    for each row
    execute function public.handle_updated_at();
