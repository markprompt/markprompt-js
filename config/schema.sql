-- Users
create table users (
  id                       uuid references auth.users on delete cascade not null primary key,
  updated_at               timestamp with time zone,
  full_name                text,
  email                    text unique not null,
  avatar_url               text,
  has_completed_onboarding boolean not null default false
);

-- RLS

-- Users

alter table users
  enable row level security;

create policy "Users can only see themselves." on users
  for select using (auth.uid() = id);

create policy "Users can insert their own user." on users
  for insert with check (auth.uid() = id);

create policy "Users can update own user." on users
  for update using (auth.uid() = id);

-- Memberships

alter table memberships
  enable row level security;

create policy "Users can only see their own memberships." on public.memberships
  for select using (auth.uid() = user_id);

create policy "Users can insert memberships they belong to." on public.memberships
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own memberships." on public.memberships
  for update using (auth.uid() = user_id);

create policy "Users can delete their own memberships." on public.memberships
  for delete using (auth.uid() = user_id);

-- Teams

alter table teams
  enable row level security;

create policy "Users can only see teams they are members of." on public.teams
  for select using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  )

-- Note: when a user creates a team, they are not yet members. So they should
-- just be able to create teams with no limitations
create policy "Users can insert teams." on public.teams
  for insert with check (true)

create policy "Users can update teams they are members of." on public.teams
  for update using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  )

create policy "Users can delete teams they are members of." on public.teams
  for delete using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = teams.id
    )
  )

-- Projects

alter table projects
  enable row level security;

create policy "Users can only see projects associated to teams they are members of." on public.projects
  for select using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  )

create policy "Users can insert projects associated to teams they are members of." on public.projects
  for insert with check (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  )

create policy "Users can update projects associated to teams they are members of." on public.projects
  for update using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  )

create policy "Users can delete projects associated to teams they are members of." on public.projects
  for delete using (
    exists (
      select 1 from memberships
      where memberships.user_id = auth.uid()
      and memberships.team_id = projects.team_id
    )
  )

-- Files

alter table files
  enable row level security;

create policy "Users can only see files associated to projects they have access to." on public.files
  for select using (
    files.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can insert files associated to projects they have access to." on public.files
  for insert with check (
    files.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can update files associated to projects they have access to." on public.files
  for update using (
    files.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can delete files associated to projects they have access to." on public.files
  for delete using (
    files.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

-- Tokens

alter table tokens
  enable row level security;

create policy "Users can only see tokens associated to projects they have access to." on public.tokens
  for select using (
    tokens.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can insert tokens associated to projects they have access to." on public.tokens
  for insert with check (
    tokens.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can delete tokens associated to projects they have access to." on public.tokens
  for delete using (
    tokens.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )


-- Domains

alter table domains
  enable row level security;

create policy "Users can only see domains associated to projects they have access to." on public.domains
  for select using (
    domains.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can insert domains associated to projects they have access to." on public.domains
  for insert with check (
    domains.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )

create policy "Users can delete domains associated to projects they have access to." on public.domains
  for delete using (
    domains.project_id in (
      select projects.id from projects
      left join memberships
      on projects.team_id = memberships.team_id
      where memberships.user_id = auth.uid()
    )
  )


-- File sections

alter table file_sections
  enable row level security;

-- No policies for file_sections: they are inaccessible to the client,
-- and only edited on the server with service_role access.

-- Triggers

-- This trigger automatically creates a user entry when a new user signs up
-- via Supabase Auth.for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'email', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Teams
create table public.teams (
  id                  uuid primary key default uuid_generate_v4(),
  inserted_at         timestamp with time zone default timezone('utc'::text, now()) not null,
  slug                text not null unique,
  name                text,
  is_personal         boolean default false,
  stripe_customer_id  text,
  stripe_price_id     text,
  billing_cycle_start timestamp with time zone,
  created_by          uuid references public.users not null
);
comment on table public.teams is 'Teams data.';

-- Projects
create table public.projects (
  id                   uuid primary key default uuid_generate_v4(),
  inserted_at         timestamp with time zone default timezone('utc'::text, now()) not null,
  slug                text not null,
  name                text not null,
  public_api_key      text not null unique,
  private_dev_api_key text not null unique,
  openai_key          text,
  github_repo         text,
  team_id             uuid references public.teams on delete cascade not null,
  is_starter          boolean not null default false,
  created_by          uuid references public.users not null
);
comment on table public.projects is 'Projects within a team.';

-- Memberships
create type membership_type as enum ('viewer', 'admin');

create table public.memberships (
  id            uuid primary key default uuid_generate_v4(),
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id       uuid references public.users not null,
  team_id       uuid references public.teams not null,
  type          membership_type not null
);
comment on table public.memberships is 'Memberships of a user in a team.';

-- Domains
create table public.domains (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  name          text not null unique,
  project_id    uuid references public.projects on delete cascade not null
);
comment on table public.domains is 'Domains associated to a project.';

-- Tokens
create table public.tokens (
  id            bigint generated by default as identity primary key,
  inserted_at   timestamp with time zone default timezone('utc'::text, now()) not null,
  value         text not null,
  project_id    uuid references public.projects on delete cascade not null,
  created_by    uuid references public.users not null
);
comment on table public.tokens is 'Tokens associated to a project.';

-- Files
create extension if not exists vector with schema public;

create table public.files (
  id          bigint generated by default as identity primary key,
  path        text not null,
  meta        jsonb,
  project_id  uuid references public.projects on delete cascade not null,
  updated_at  timestamp with time zone default timezone('utc'::text, now()) not null
);

-- File sections
create table public.file_sections (
  id          bigint generated by default as identity primary key,
  file_id     bigint not null references public.files on delete cascade,
  content     text,
  token_count int,
  embedding   vector(1536)
);

create or replace function match_file_sections(project_id uuid, embedding vector(1536), match_threshold float, match_count int, min_content_length int)
returns table (path text, content text, token_count int, similarity float)
language plpgsql
as $$
#variable_conflict use_variable
begin
  return query
  select
    files.path,
    file_sections.content,
    file_sections.token_count,
    (file_sections.embedding <#> embedding) * -1 as similarity
  from file_sections
  join files
    on file_sections.file_id = files.id

  where files.project_id = project_id

  -- We only care about sections that have a useful amount of content
  and length(file_sections.content) >= min_content_length

  -- The dot product is negative because of a Postgres limitation, so we negate it
  and (file_sections.embedding <#> embedding) * -1 > match_threshold

  -- OpenAI embeddings are normalized to length 1, so
  -- cosine similarity and dot product will produce the same results.
  -- Using dot product which can be computed slightly faster.
  --
  -- For the different syntaxes, see https://github.com/pgvector/pgvector
  order by file_sections.embedding <#> embedding

  limit match_count;
end;
$$;

create index idx_project_id on files(project_id);
create index idx_file_id on file_sections(file_id);
