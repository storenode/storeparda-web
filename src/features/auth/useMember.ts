import { useLiveQuery } from "dexie-react-hooks";
import { db, type Member } from "@/db";
import { getMemberJwt } from "@/lib/memberSession";

export interface MemberState {
  member: Member | undefined;
  isLoading: boolean;
  isSignedIn: boolean;
}

const PENDING = Symbol("pending");

/**
 * Offline-capable: reads the cached member profile straight from Dexie, no network
 * call. A member counts as signed in only if both the cached profile AND the stored
 * JWT are present — either alone isn't a valid session.
 *
 * Uses a distinct PENDING sentinel as the useLiveQuery default, rather than
 * `undefined` — an empty (never-signed-in) result is also `undefined` once the query
 * resolves, so `undefined` alone can't distinguish "still loading" from "no member".
 */
export function useMember(): MemberState {
  const result = useLiveQuery<Member | null, typeof PENDING>(
    () => db.members.toCollection().first().then((m) => m ?? null),
    [],
    PENDING,
  );

  const isLoading = result === PENDING;
  const member = isLoading || result === null ? undefined : result;
  const isSignedIn = Boolean(member && getMemberJwt());

  return { member, isLoading, isSignedIn };
}
