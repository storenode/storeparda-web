// mint-member-session
//
// Called by the client immediately after supabase.auth.signInWithOAuth({ provider: "google" })
// completes its redirect round-trip. Supabase's OAuth handshake (and its auth.users row) is
// treated as disposable plumbing — this function is what actually establishes StoreParda's
// identity: it reads the Google profile Supabase captured, upserts a `members` row keyed on
// Google's stable `sub` claim, and mints StoreParda's own JWT (sub = members.id) so RLS's
// auth.uid() works against `members`, not `auth.users`.
//
// See specs/tasks/M1-auth-google.md for the full design.

import { createClient } from "npm:@supabase/supabase-js@2";
import { SignJWT } from "npm:jose@5";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Not SUPABASE_JWT_SECRET — the SUPABASE_ prefix is reserved for the platform's own
// auto-injected vars and `supabase secrets set` refuses to accept it.
const JWT_SECRET = Deno.env.get("APP_JWT_SECRET")!;

const JWT_TTL_SECONDS = 60 * 60; // 1 hour — see spec's open question on refresh strategy

// Edge Functions don't add CORS headers automatically — the browser calls this
// cross-origin (localhost:5173 / the deployed app origin -> *.supabase.co), and
// without these every request is blocked at the preflight stage before the function
// code even runs. Wide open (`*`) for now; narrowing to the real app origin(s) is
// worth doing before this goes to real users.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  // x-client-info and x-supabase-api-version are added automatically by
  // supabase-js's functions.invoke() — missing either here fails preflight.
  "Access-Control-Allow-Headers":
    "authorization, apikey, content-type, x-client-info, x-supabase-api-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders });
}

async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return json({ error: "Missing bearer token" }, 401);
  }
  const callerToken = authHeader.slice("Bearer ".length);

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !JWT_SECRET) {
    console.error("Missing env vars:", {
      hasUrl: Boolean(SUPABASE_URL),
      hasServiceRole: Boolean(SERVICE_ROLE_KEY),
      hasJwtSecret: Boolean(JWT_SECRET),
    });
    return json({ error: "Function misconfigured (missing env vars)" }, 500);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Resolve the caller's Supabase-managed OAuth session to a Google identity.
  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(callerToken);

  if (userError || !user) {
    console.error("getUser failed:", userError);
    return json({ error: `Invalid or expired session: ${userError?.message ?? "no user"}` }, 401);
  }

  const googleIdentity = user.identities?.find((i) => i.provider === "google");
  if (!googleIdentity) {
    return json({ error: "No Google identity on this session" }, 400);
  }

  const claims = googleIdentity.identity_data ?? {};
  const googleId = String(claims.sub ?? googleIdentity.id);
  const googleEmail = String(claims.email ?? user.email ?? "");

  if (!googleId || !googleEmail) {
    return json({ error: "Google identity payload missing sub/email" }, 400);
  }

  const profile = {
    google_id: googleId,
    google_email: googleEmail,
    email_verified: Boolean(claims.email_verified ?? false),
    first_name: (claims.given_name as string | undefined) ?? null,
    last_name: (claims.family_name as string | undefined) ?? null,
    avatar_url: (claims.picture as string | undefined) ?? null,
    locale: (claims.locale as string | undefined) ?? null,
    last_modified_at: new Date().toISOString(),
  };

  // Upsert keyed on google_id — the stable identifier, not the mutable email.
  const { data: member, error: upsertError } = await admin
    .from("members")
    .upsert(profile, { onConflict: "google_id" })
    .select("id, google_id, google_email, email_verified, first_name, last_name, avatar_url, locale")
    .single();

  if (upsertError || !member) {
    console.error("members upsert failed:", upsertError);
    return json(
      {
        error: "Failed to persist member",
        detail: upsertError?.message,
        code: upsertError?.code,
        hint: upsertError?.hint,
      },
      500,
    );
  }

  // Mint StoreParda's own JWT: sub = members.id, not the auth.users id. RLS's auth.uid()
  // reads this sub claim regardless of whether that id exists in auth.users.
  const secretKey = new TextEncoder().encode(JWT_SECRET);
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({
    role: "authenticated",
    aud: "authenticated",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(member.id)
    .setIssuedAt(now)
    .setExpirationTime(now + JWT_TTL_SECONDS)
    .sign(secretKey);

  return json({ jwt, member });
}

Deno.serve(async (req) => {
  try {
    return await handle(req);
  } catch (e) {
    console.error("Unhandled error in mint-member-session:", e);
    return json(
      { error: "Unhandled error", detail: e instanceof Error ? e.message : String(e) },
      500,
    );
  }
});
