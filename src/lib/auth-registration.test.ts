import { test } from "node:test";
import { strictEqual, ok } from "node:assert";
import { randomBytes } from "node:crypto";

test("public self-registration is disabled even through the direct authentication endpoint", async () => {
  const origin = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  ok(origin, "Public authentication URL must be configured");
  ok(key, "Public authentication key must be configured");
  const headers = { apikey: key, "Content-Type": "application/json" };
  const settings = await fetch(`${origin}/auth/v1/settings`, { headers });
  strictEqual(settings.status, 200);
  strictEqual((await settings.json()).disable_signup, true);
  const signup = await fetch(`${origin}/auth/v1/signup`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: "blocked-registration-check@example.com",
      password: randomBytes(24).toString("base64url"),
    }),
  });
  strictEqual(signup.status, 422);
  strictEqual((await signup.json()).error_code, "signup_disabled");
});