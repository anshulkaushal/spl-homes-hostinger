import { cookies } from "next/headers";
import { listLeads } from "@/lib/leads";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Admin",
  description: "SPL Homes enquiry administration.",
  path: "/admin",
  index: false,
});

export default async function AdminPage() {
  const jar = await cookies();
  const authed = jar.get("spl_admin")?.value === "1";
  const leads = authed ? await listLeads() : [];
  const passwordSet = Boolean(process.env.ADMIN_PASSWORD);

  return (
    <div className="bg-paper-2 px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display text-4xl">Admin</h1>
        <p className="mt-2 text-ink-soft">Leads only in this first version. Full CMS follows.</p>

        {!authed ? (
          <form action="/admin/login" method="post" className="mt-8 max-w-md bg-cream p-6">
            <label className="block text-sm font-medium">
              Admin password
              <input
                type="password"
                name="password"
                className="mt-1 min-h-12 w-full border border-stone bg-paper px-3"
              />
            </label>
            <button type="submit" className="mt-4 min-h-12 bg-forest px-5 text-sm font-semibold uppercase tracking-wide text-cream">
              Sign in
            </button>
            {!passwordSet ? (
              <p className="mt-4 text-sm text-ink-soft">
                Set ADMIN_PASSWORD in your environment before using this on a shared machine.
              </p>
            ) : null}
          </form>
        ) : (
          <div className="mt-8 overflow-x-auto bg-cream">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stone text-xs uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Synthetic</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td className="p-4 text-ink-soft" colSpan={7}>
                      No enquiries yet.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-stone">
                      <td className="p-3 font-medium">{lead.reference}</td>
                      <td className="p-3">{lead.created_at.slice(0, 10)}</td>
                      <td className="p-3">
                        {lead.name}
                        <br />
                        <span className="text-ink-soft">{lead.email}</span>
                      </td>
                      <td className="p-3">{lead.project_type}</td>
                      <td className="p-3">{lead.source}</td>
                      <td className="p-3">{lead.status}</td>
                      <td className="p-3">{lead.is_synthetic ? "Yes" : "No"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
