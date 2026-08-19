import { config } from "dotenv";

// Vite only exposes VITE_-prefixed vars to the app, but this script runs under plain
// Node (not Vite), so it reads the same .env.local directly via process.env.
config({ path: ".env.local" });

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local.\n" +
      "See specs/tasks/M0.6-supabase-setup.md for where to get these values.",
  );
  process.exit(1);
}

if (url.includes("xxxx")) {
  console.error(
    `VITE_SUPABASE_URL is still the placeholder value (${url}) — put your real ` +
      "project URL in .env.local. See specs/tasks/M0.6-supabase-setup.md.",
  );
  process.exit(1);
}

// auth.getSession() alone doesn't make a network call — it just reads local state,
// so it would "pass" even against a placeholder URL. Hit the project's public auth
// settings endpoint directly to prove the URL + anon key actually reach a live project.
const response = await fetch(`${url}/auth/v1/settings`, {
  headers: { apikey: anonKey },
});

if (!response.ok) {
  console.error(
    `Supabase connection failed: ${response.status} ${response.statusText} — ` +
      "check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.",
  );
  process.exit(1);
}

console.log(`Supabase connection OK — ${url}`);
