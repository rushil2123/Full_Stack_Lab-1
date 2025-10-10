import { useState } from "react";
import "./OrganizationPage.css";
import { roleRepo } from "../repositories/roleRepo";
import { useEntryForm } from "../hook/useEntryForm";
import type { Role, Department } from "../types";

export default function OrganizationPage() {
  const [viewDept, setViewDept] = useState<Department>("Finance");
  const form = useEntryForm("role");

  const allRoles: Role[] = roleRepo.list();
  const rolesByDept = allRoles.filter((r) => r.department === viewDept);

  return (
    <main>
      <h1>Organization</h1>
      <p className="greeting">View roles by department and add new roles.</p>

      {/* Choose department to view */}
      <label>
        Department to view
        <select
          value={viewDept}
          onChange={(e) => setViewDept(e.target.value as Department)}
        >
          {form.departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      {/* Add a role */}
      <section style={{ marginTop: "1rem" }}>
        <h2>Add Role</h2>

        <div style={{ marginBottom: 8 }}>
          <label>
            Role Title
            <input
              value={form.values.name}
              onChange={(e) => form.change("name", e.target.value)}
            />
          </label>
          {form.errors.name && <div role="alert">{form.errors.name}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Department
            <select
              value={form.values.department}
              onChange={(e) => form.change("department", e.target.value)}
            >
              {form.departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          {form.errors.department && (
            <div role="alert">{form.errors.department}</div>
          )}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Person (optional)
            <input
              placeholder="Leave blank if unfilled"
              value={form.values.person || ""}
              onChange={(e) => form.change("person", e.target.value)}
            />
          </label>
        </div>

        <button onClick={form.submit} disabled={form.saving}>
          {form.saving ? "Saving..." : "Create Role"}
        </button>
      </section>

      {/* Roles list */}
      <ul style={{ marginTop: "1rem" }}>
        {rolesByDept.map((r, i) => (
          <li key={r.id || i}>
            <strong>{r.title}</strong> —{" "}
            {r.person ? `Filled by ${r.person}` : "Unfilled"}
          </li>
        ))}
      </ul>

      {rolesByDept.length === 0 && <p>No roles in this department.</p>}
    </main>
  );
}
