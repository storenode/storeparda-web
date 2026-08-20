-- Minimal safety default: deny all direct table access until real RLS policies are
-- designed (a separate, still-to-be-created follow-up task). Without this, the
-- members table — email, name, avatar — is fully readable by anyone holding the
-- public anon key, since Supabase exposes every table over PostgREST by default.
--
-- The Edge Function (mint-member-session) is unaffected: it uses the service-role
-- key, which bypasses RLS entirely.

alter table members enable row level security;
