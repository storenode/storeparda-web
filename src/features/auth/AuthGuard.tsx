import { Navigate, Outlet } from "react-router-dom";
import { useMember } from "@/features/auth/useMember";

/**
 * Offline-capable guard: reads the cached member from Dexie (no network call), so a
 * previously signed-in user reaches /app/* fully offline. See "Offline-first" in
 * specs/tasks/M1-auth-google.md.
 */
export function AuthGuard() {
  const { isLoading, isSignedIn } = useMember();

  if (isLoading) return null;
  if (!isSignedIn) return <Navigate to="/" replace />;

  return <Outlet />;
}
