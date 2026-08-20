import { supabaseAuthClient } from "@/lib/supabaseAuthClient";

/**
 * Kicks off Supabase's Google OAuth handshake. This is only a credential check —
 * the resulting Supabase-managed session is disposable plumbing, consumed once by
 * AuthCallbackPage (which calls mint-member-session) and then discarded. See
 * specs/tasks/M1-auth-google.md.
 */
export async function signInWithGoogle() {
  const { error } = await supabaseAuthClient.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}
