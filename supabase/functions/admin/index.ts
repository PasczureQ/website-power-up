// Admin edge function: validates password, then performs CRUD on tables/storage with service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_TABLES = new Set([
  "portfolio", "products", "specs", "sponsors", "steam_games", "gallery", "socials", "site_content",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminPassword = Deno.env.get("ADMIN_PASSWORD") ?? "";
    const provided = req.headers.get("x-admin-password") ?? "";
    if (!adminPassword || provided !== adminPassword) {
      return json({ error: "unauthorized" }, 401);
    }

    const body = await req.json();
    const { action, table, payload, id, key, path } = body ?? {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "verify") return json({ ok: true });

    if (action === "upload") {
      // payload: { base64, filename, contentType }
      const { base64, filename, contentType } = payload;
      const bin = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const safe = `${Date.now()}-${(filename || "file").replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from("media").upload(safe, bin, {
        contentType: contentType || "application/octet-stream",
        upsert: false,
      });
      if (error) return json({ error: error.message }, 400);
      const { data } = supabase.storage.from("media").getPublicUrl(safe);
      // Also record in gallery
      await supabase.from("gallery").insert({ url: data.publicUrl, name: filename ?? safe });
      return json({ url: data.publicUrl });
    }

    if (action === "deleteFile") {
      const { error } = await supabase.storage.from("media").remove([path]);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (table && !ALLOWED_TABLES.has(table)) return json({ error: "bad table" }, 400);

    if (action === "insert") {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }
    if (action === "update") {
      const q = supabase.from(table).update(payload);
      const { data, error } = id ? await q.eq("id", id).select() : await q.eq("key", key).select();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }
    if (action === "upsert") {
      const { data, error } = await supabase.from(table).upsert(payload).select();
      if (error) return json({ error: error.message }, 400);
      return json(data);
    }
    if (action === "delete") {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "unknown action" }, 400);
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
