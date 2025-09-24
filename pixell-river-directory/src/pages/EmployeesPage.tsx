import { useMemo, useState } from "react";
import data from "../data/employees.json";
import type { DepartmentGroup } from "../types";
import DepartmentCard from "../components/DepartmentCard";

export default function EmployeesPage() {
  const groups = (data as DepartmentGroup[]) ?? [];
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map(g => ({
        department: g.department,
        employees: g.employees.filter(name =>
          name.toLowerCase().includes(query) ||
          g.department.toLowerCase().includes(query)
        )
      }))
      .filter(g => g.employees.length > 0);
  }, [q, groups]);

  return (
    <main id="main-content">
      <div className="page-header">
        <h1>Employee Directory</h1>
        <p className="greeting">Search by name or department.</p>
      </div>

      <div className="toolbar">
        <label className="sr-only" htmlFor="emp-search">Search employees</label>
        <input
          id="emp-search"
          type="search"
          placeholder="Type to filter…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="input"
        />
      </div>

      <section aria-labelledby="directory-heading" className="directory">
        <h2 id="directory-heading" className="sr-only">Departments and employees</h2>
        {filtered.map(g => (
          <DepartmentCard
            key={g.department}
            department={g.department}
            employees={g.employees}
          />
        ))}
        {filtered.length === 0 && <p>No matches found.</p>}
      </section>
    </main>
  );
}
