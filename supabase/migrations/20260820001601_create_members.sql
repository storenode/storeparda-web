-- M1-auth-google: members table.
-- Google is used only as a credential check (see specs/tasks/M1-auth-google.md) —
-- Supabase's auth.users is disposable plumbing, this table is the real identity store.

create table members (
  id                uuid primary key default gen_random_uuid(),
  google_id         text not null,   -- Google's stable "sub" claim — the real dedup key
  google_email      text not null,
  email_verified    boolean not null default false,
  first_name        text,
  last_name         text,
  avatar_url        text,
  locale            text,
  pin               text,            -- reserved for the email-OTP follow-up task; unused/null for now
  created_at        timestamptz not null default now(),
  last_modified_at  timestamptz not null default now(),
  deleted_at        timestamptz
);

create unique index members_google_id_idx on members (google_id) where deleted_at is null;
create index members_google_email_idx on members (google_email) where deleted_at is null;

comment on table members is 'StoreParda member identities, keyed on Google''s stable sub claim. Not linked to auth.users.';
