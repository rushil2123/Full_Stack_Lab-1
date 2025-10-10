import "./OrganizationPage.css";
import { useState } from "react";
import { roleRepo } from "../repositories/orgRepo";
import { useEntryForm } from "../hooks/useEntryForm";
import type { OrgRole } from "../types";

export default function OrganizationPage() {
  const form = useEntryForm("role");

  const roles: OrgRole[] = roleRepo.list();

  const [q, setQ] = useState("");
  const s = q.toLowerCase();
  const filtered = roles.filter(
    (r) =>
      r.title.toLowerCase().includes(s) ||
      (r.person && r.person.toLowerCase().includes(s))
  );

  return (
    <main>
      <h1>Organization</h1>
      <p className="greeting">View roles and add a new role.</p>

      <label htmlFor="role-search" className="sr-only">
        Search roles
      </label>
      <input
        id="role-search"
        placeholder="Search by title or person"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <section style={{ marginTop: "1rem" }}>
        <h2>Add Role</h2>

        <div style={{ marginBottom: 8 }}>
          <label>
            Role Title
            <input
              value={(form.values.kind === "role" && form.values.title) || ""}
              onChange={(e) => form.change("title", e.target.value)}
            />
          </label>
          {form.errors.title && <div role="alert">{form.errors.title}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Person (optional)
            <input
              placeholder="Leave blank if unfilled"
              value={(form.values.kind === "role" && (form.values.person || "")) || ""}
              onChange={(e) => form.change("person", e.target.value)}
            />
          </label>
        </div>

        <button onClick={form.submit} disabled={form.saving}>
          {form.saving ? "Saving..." : "Create Role"}
        </button>
      </section>

      <ul style={{ marginTop: "1rem" }}>
        {filtered.map((r, i) => (
          <li key={r.title + (r.person || "") + i}>
            <strong>{r.title}</strong>
            {" — "}
            {r.person ? `Filled by ${r.person}` : "Unfilled"}
            {r.description ? ` — ${r.description}` : ""}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p>No roles match.</p>}
    </main>
  );
}
