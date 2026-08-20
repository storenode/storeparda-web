-- The original partial unique index (WHERE deleted_at IS NULL) can't be used as an
-- ON CONFLICT arbiter by a plain `.upsert(..., { onConflict: "google_id" })` call —
-- Postgres requires the ON CONFLICT target to exactly match a constraint, and a
-- partial index only matches a conflict clause that repeats the same WHERE, which
-- supabase-js doesn't generate. Confirmed via mint-member-session's real error:
-- "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- (42P10).
--
-- Trade-off accepted for now: this makes google_id unique across ALL rows, including
-- soft-deleted ones — a member can't re-register with the same Google account after
-- a soft delete without also clearing/reusing that row. No delete flow exists yet in
-- this task, so this isn't a live concern; worth revisiting if/when one is built.

drop index if exists members_google_id_idx;
alter table members add constraint members_google_id_key unique (google_id);
