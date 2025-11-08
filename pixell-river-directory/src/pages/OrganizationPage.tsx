import { useEffect, useMemo, useRef, useState } from "react";
import * as orgRepo from "../repositories/orgRepo";
import type { OrgRole } from "../types";

export default function OrganizationPage() {
  const [roles, setRoles] = useState<OrgRole[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Store last added role for flash effect
  const lastAddedRef = useRef<{ title: string } | null>(null);

  const refresh = async (term?: string) => {
    setLoading(true);
    setErr(null);
    try {
      const data = await orgRepo.listRoles(term);
      setRoles(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load organization roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  // Debounced search to avoid constant reloads while typing
  const debouncedSearch = useMemo(() => {
    let timeout: number | undefined;
    return (term: string) => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => refresh(term), 300);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const person = String(form.get("person") || "").trim();
    const description = String(form.get("description") || "").trim();

    if (!title) return;

    try {
      await orgRepo.addRole({ title, person, description });
      (e.currentTarget as HTMLFormElement).reset();

      // Reset search to show full list and trigger live refresh
      setSearch("");
      lastAddedRef.current = { title };
      await refresh();

      // Remove flash marker after 1.5s
      window.setTimeout(() => {
        lastAddedRef.current = null;
      }, 1500);
    } catch (error: any) {
      alert(error?.message || "Failed to add role");
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search by title or person"
          value={search}
          onChange={(e) => {
            const term = e.target.value;
            setSearch(term);
            debouncedSearch(term);
          }}
        />
      </div>

      {/* Add Role Form */}
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="title" placeholder="Role title" />
        <input className="input" name="person" placeholder="Assigned person (optional)" />
        <input className="input" name="description" placeholder="Description (optional)" />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {err && <p className="error">{err}</p>}
      {loading && <p>Loading...</p>}

      {/* Roles grid (matches EmployeesPage layout) */}
      <div className="directory roles-grid">
        {roles.map((r) => {
          const shouldFlash =
            lastAddedRef.current && lastAddedRef.current.title === r.title;

          return (
            <details
              key={r.id}
              className={`role-details ${shouldFlash ? "flash" : ""}`}
            >
              <summary>
                <strong>{r.title}</strong>
                {r.person ? ` — ${r.person}` : ""}
              </summary>
              <div className="role-body">
                {r.description ? (
                  <p>{r.description}</p>
                ) : (
                  <p style={{ fontStyle: "italic", color: "#777" }}>
                    No description provided.
                  </p>
                )}
                <small style={{ color: "#888" }}>
                  Created on {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
