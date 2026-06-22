import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: isAdmin } = await admin.rpc("is_affiliate_admin", { _user_id: userData.user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action = String(body.action || "list");

    const fetchAdmins = async () => {
      const { data: roles, error } = await admin
        .from("user_roles")
        .select("user_id")
        .eq("role", "affiliate_admin");
      if (error) throw error;
      const ids = (roles || []).map((r: any) => r.user_id);
      if (!ids.length) return [];
      const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
      return (users?.users || [])
        .filter((u: any) => ids.includes(u.id))
        .map((u: any) => ({ id: u.id, email: u.email, created_at: u.created_at }));
    };

    if (action === "list") {
      const admins = await fetchAdmins();
      return new Response(JSON.stringify({ admins }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email || !email.includes("@")) {
        return new Response(JSON.stringify({ error: "Valid email required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // Find user
      const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
      let user = (users?.users || []).find((u: any) => (u.email || "").toLowerCase() === email);
      if (!user) {
        // Invite them so they can set a password
        const origin = req.headers.get("origin") || "https://rasgoal.com";
        const url = new URL(origin);
        const baseHost = url.hostname.replace(/^affiliates?\./i, "");
        const mainSiteUrl = `${url.protocol}//${baseHost}`;
        const { data: inv, error: invErr } = await admin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${mainSiteUrl}/affiliate/set-password`,
        });
        if (invErr) throw invErr;
        user = inv.user;
      }
      if (!user) throw new Error("Could not create or find user");
      // Insert role (ignore conflict)
      const { error: roleErr } = await admin
        .from("user_roles")
        .insert({ user_id: user.id, role: "affiliate_admin" });
      if (roleErr && !String(roleErr.message).toLowerCase().includes("duplicate")) {
        throw roleErr;
      }
      return new Response(JSON.stringify({ ok: true, message: "Admin added" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "remove") {
      const targetUserId = String(body.user_id || "");
      if (!targetUserId) {
        return new Response(JSON.stringify({ error: "user_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (targetUserId === userData.user.id) {
        return new Response(JSON.stringify({ error: "You cannot remove yourself" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", targetUserId)
        .eq("role", "affiliate_admin");
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, message: "Admin removed" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
