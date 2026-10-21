import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const roleSchema = z.enum(["admin", "moderator", "user"]);
const registerSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
  role: roleSchema,
});
const roleUpdateSchema = z.object({ userId: z.string().uuid(), role: roleSchema });
const removeSchema = z.object({ userId: z.string().uuid() });

type AdminContext = { supabase: any; userId: string };

async function requireAdmin(context: AdminContext) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden: administrator role required");
}

export type ManagedUser = {
  id: string;
  email: string;
  role: "admin" | "moderator" | "user";
  created_at: string;
  last_sign_in_at: string | null;
};

export const listManagedUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ManagedUser[]> => {
    await requireAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: authData, error: authError }, { data: roles, error: rolesError }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (authError) throw new Error("Could not load accounts");
    if (rolesError) throw new Error("Could not load roles");
    const roleByUser = new Map((roles ?? []).map(row => [row.user_id, row.role as ManagedUser["role"]]));
    return (authData?.users ?? [])
      .map(account => ({
        id: account.id,
        email: account.email ?? "",
        role: roleByUser.get(account.id) ?? "user",
        created_at: account.created_at,
        last_sign_in_at: account.last_sign_in_at ?? null,
      }))
      .sort((a, b) => a.email.localeCompare(b.email));
  });

export const registerManagedUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => registerSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context as AdminContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error || !created.user) throw new Error(error?.message ?? "Account could not be created");
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: data.role });
    if (roleError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      throw new Error("Role could not be assigned; account was not kept");
    }
    return { success: true, id: created.user.id };
  });

export const updateManagedUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => roleUpdateSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context as AdminContext);
    if (data.userId === (context as AdminContext).userId) {
      throw new Error("You cannot change your own role");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id" });
    if (error) throw new Error("Role could not be updated");
    return { success: true };
  });

export const removeManagedUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => removeSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context as AdminContext);
    if (data.userId === (context as AdminContext).userId) {
      throw new Error("You cannot remove your own account");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error("Account could not be removed");
    return { success: true };
  });
