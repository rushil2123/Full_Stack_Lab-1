import roles from "../data/org.json";
import type { OrgRole } from "../types";

export default function OrganizationPage() {
  const data = (roles as OrgRole[]) ?? [];

  return (
    <main id="main-content">
      <div className="page-header">
        <h1>Organization</h1>
        <p className="greeting">Leadership &amp; Management</p>
      </div>

      <section aria-labelledby="roles-heading">
        <h2 id="roles-heading" className="sr-only">Roles</h2>

        {data.map((r) => (
          <details key={r.title} className="role-details">
            <summary>
              <strong>{r.title}</strong> — {r.person}
            </summary>
            <div className="role-body">
              <p>{r.description || "Description not provided yet."}</p>
            </div>
          </details>
        ))}

        {data.length === 0 && <p>No roles provided yet.</p>}
      </section>
    </main>
  );
}
