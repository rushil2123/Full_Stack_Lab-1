// src/pages/EmployeesPage.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import * as employeesRepo from "../repositories/employeeRepo";
import type { DepartmentGroup } from "../types";
import "../pages/EmployeesPage.css";

export default function EmployeesPage() {
  const [groups, setGroups] = useState<DepartmentGroup[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Keep track of the last added employee so we can flash it briefly
  const lastAddedRef = useRef<{ name: string; department: string } | null>(null);

  const refresh = async (term?: string) => {
    setLoading(true);
    setErr(null);
    try {
      const data = await employeesRepo.listEmployees(term);
      setGroups(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Mount: load initial data
  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  // Simple debounce for search (optional but nicer UX)
  const debouncedSearch = useMemo(() => {
    let t: number | undefined;
    return (term: string) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        refresh(term);
      }, 300);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const department = String(form.get("department") || "").trim();
    if (!name || !department) return;

    try {
      await employeesRepo.addEmployee({ name, department });
      (e.currentTarget as HTMLFormElement).reset();

      // Clear any active filter so the new item is visible,
      // then refresh the full, unfiltered list
      setSearch("");
      lastAddedRef.current = { name, department };
      await refresh();

      // Clear the flash after a short time
      window.setTimeout(() => {
        lastAddedRef.current = null;
        // No need to force a render; the flash animation is visual only
      }, 1500);
    } catch (error: any) {
      alert(error?.message || "Failed to add employee");
    }
  };

  return (
    <div>
      {/* Toolbar / Search */}
      <div className="toolbar">
        <input
          className="input"
          placeholder="Search employees or departments"
          value={search}
          onChange={(e) => {
            const term = e.target.value;
            setSearch(term);
            debouncedSearch(term);
          }}
        />
      </div>

      {/* Add Form */}
      <form className="form" onSubmit={onSubmit}>
        <input className="input" name="name" placeholder="Full name" />
        <input className="input" name="department" placeholder="Department" />
        <button className="btn btn-primary" type="submit">
          Add
        </button>
      </form>

      {err ? <p className="error">{err}</p> : null}
      {loading ? <p>Loading…</p> : null}

      {/* Directory grid */}
      <div className="directory">
        {groups.map((g) => (
          <section className="dept-card" key={g.id}>
            <h4>
              {g.department}
              <span className="count">{g.employees.length}</span>
            </h4>
            <ul>
              {g.employees.map((n, i) => {
                const shouldFlash =
                  lastAddedRef.current &&
                  lastAddedRef.current.department === g.department &&
                  lastAddedRef.current.name === n;

                return (
                  <li className={shouldFlash ? "flash" : ""} key={`${g.id}:${i}`}>
                    {n}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
