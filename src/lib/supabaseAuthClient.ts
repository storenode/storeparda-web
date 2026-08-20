import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseAnonKey } from "@/lib/supabaseEnv";

/**
 * A plain, default-configured Supabase client used ONLY for the Google OAuth
 * handshake (signInWithOAuth, getSession in the callback page, and the
 * mint-member-session invoke that needs the OAuth session's own token).
 *
 * Deliberately separate from `supabase` in supabaseClient.ts: that client is
 * configured with a custom `accessToken` option for the member's own JWT, and
 * supabase-js explicitly disables `auth.*` methods (signInWithOAuth included) on
 * any client configured that way — the two roles can't share one client instance.
 * This client's own session is disposable plumbing, signed out of immediately after
 * the handshake completes (see AuthCallbackPage.tsx).
 */
export const supabaseAuthClient = createClient(supabaseUrl, supabaseAnonKey);
