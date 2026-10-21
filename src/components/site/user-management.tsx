import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { UserPlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listManagedUsers, registerManagedUser, updateManagedUserRole, removeManagedUser } from "@/lib/users.functions";

const roleOptions = [
  { value: "user", label: "User", detail: "Can sign in; no editing access" },
  { value: "moderator", label: "Moderator", detail: "Reserved for future limited editing" },
  { value: "admin", label: "Administrator", detail: "Full access to manage the site" },
] as const;

export function UserManagement({ currentUserId }: { currentUserId: string }) {
  const qc = useQueryClient();
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const fetchUsers = useServerFn(listManagedUsers);
  const register = useServerFn(registerManagedUser);
  const updateRole = useServerFn(updateManagedUserRole);
  const removeUser = useServerFn(removeManagedUser);
  const { data: users = [], isPending, error } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => fetchUsers(),
  });

  async function refresh() {
    await qc.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  async function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    const form = event.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    try {
      await register({ data: { email: String(fd.get("email") || ""), password: String(fd.get("password") || ""), role: String(fd.get("role") || "user") as "admin" | "moderator" | "user" } });
      form.reset();
      setNotice("Account created. The new user can sign in right away.");
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Account could not be created.");
    } finally {
      setBusy(false);
    }
  }

  async function changeRole(userId: string, role: string) {
    setNotice("");
    try {
      await updateRole({ data: { userId, role: role as "admin" | "moderator" | "user" } });
      setNotice("Role updated.");
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Role could not be updated.");
    }
  }

  async function deleteUser(userId: string, email: string) {
    if (!window.confirm(`Remove the account ${email} permanently?`)) return;
    setNotice("");
    try {
      await removeUser({ data: { userId } });
      setNotice("Account removed.");
      await refresh();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Account could not be removed.");
    }
  }

  if (error) {
    return <div role="alert" className="py-10"><p>Unable to load user accounts. Please try again.</p><Button variant="outline" className="mt-4" onClick={refresh}>Retry</Button></div>;
  }

  return <div className="mt-8 space-y-10">
    <section className="rounded-md border border-border bg-card p-6 md:p-8">
      <h2 className="flex items-center gap-2 text-xl font-semibold"><UserPlus size={20} className="text-sage"/> Register a new user</h2>
      <p className="mt-2 text-sm text-muted-foreground">Create an account and choose what it can do. New accounts can sign in immediately — no email confirmation needed.</p>
      <form onSubmit={addUser} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">Email<input name="email" type="email" required maxLength={255} className="mt-2 h-11 w-full border border-input bg-background px-3"/></label>
        <label className="text-sm font-semibold">Password <span className="text-muted-foreground">(min 8 characters)</span><input name="password" type="password" required minLength={8} maxLength={128} className="mt-2 h-11 w-full border border-input bg-background px-3"/></label>
        <label className="text-sm font-semibold sm:col-span-2">Role<select name="role" defaultValue="user" className="mt-2 h-11 w-full border border-input bg-background px-3">{roleOptions.map(option => <option key={option.value} value={option.value}>{option.label} — {option.detail}</option>)}</select></label>
        <div className="sm:col-span-2 flex justify-end"><Button type="submit" disabled={busy}>{busy ? "Creating…" : "Create account"}</Button></div>
      </form>
    </section>
    <section>
      <h2 className="text-xl font-semibold">Registered users</h2>
      {isPending ? <p role="status" className="py-8 text-muted-foreground">Loading accounts…</p> : users.length ? <div className="mt-4 divide-y divide-border border-y border-border">{users.map(account => {
        const isSelf = account.id === currentUserId;
        return <div key={account.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="min-w-0">
            <p className="break-all font-semibold">{account.email}{isSelf && <span className="ml-2 text-xs font-normal text-muted-foreground">(you)</span>}</p>
            <p className="mt-1 text-xs text-muted-foreground">Joined {new Date(account.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}{account.last_sign_in_at ? ` · Last sign-in ${new Date(account.last_sign_in_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : " · Never signed in"}</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor={`role-${account.id}`}>Role for {account.email}</label>
            <select id={`role-${account.id}`} value={account.role} disabled={isSelf} onChange={event => changeRole(account.id, event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">{roleOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
            <Button variant="outline" size="icon" disabled={isSelf} title={isSelf ? "You cannot remove your own account" : `Remove ${account.email}`} aria-label={`Remove ${account.email}`} onClick={() => deleteUser(account.id, account.email)}><Trash2/></Button>
          </div>
        </div>;
      })}</div> : <p className="py-8 text-muted-foreground">No accounts yet.</p>}
    </section>
    <p role="status" className="text-sm text-muted-foreground">{notice}</p>
  </div>;
}
