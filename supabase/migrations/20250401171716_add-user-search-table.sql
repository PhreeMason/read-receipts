Create table user_searches (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users on delete cascade,
    query text not null,
    result_count int not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);