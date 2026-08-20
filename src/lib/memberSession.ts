/**
 * Storage for StoreParda's own member JWT (sub = members.id, minted by the
 * mint-member-session Edge Function) — deliberately separate from Dexie, which is
 * for data records that mirror Supabase tables, not bearer credentials. Also
 * deliberately separate from supabase-js's own session storage: that JWT has no
 * matching Supabase-issued refresh token, so it can't go through
 * supabase.auth.setSession()'s normal refresh machinery.
 *
 * See specs/tasks/M1-auth-google.md.
 */

const STORAGE_KEY = "sp_member_jwt";

export function getMemberJwt(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setMemberJwt(jwt: string): void {
  localStorage.setItem(STORAGE_KEY, jwt);
}

export function clearMemberJwt(): void {
  localStorage.removeItem(STORAGE_KEY);
}
