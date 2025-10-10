import { useState } from "react";
import "./EmployeesPage.css";
import { employeeRepo } from "../repositories/employeeRepo";
import { useEntryForm } from "../hook/useEntryForm";
import type { Employee } from "../types";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const form = useEntryForm("employee");

  // small app, so just read the repo each render
  const allEmployees: Employee[] = employeeRepo.list();

  // basic search by name or department
  const s = search.toLowerCase();
  const filtered = allEmployees.filter((e) => {
    return (
      e.name.toLowerCase().includes(s) ||
      e.department.toLowerCase().includes(s)
    );
  });

  return (
    <main>
      <h1>Employees</h1>
      <p className="greeting">Search and add employees.</p>

      {/* Search */}
      <label htmlFor="emp-search" className="sr-only">
        Search employees
      </label>
      <input
        id="emp-search"
        placeholder="Search by name or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Add new employee */}
      <section style={{ marginTop: "1rem" }}>
        <h2>Add Employee</h2>

        <div style={{ marginBottom: 8 }}>
          <label>
            Name
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

        <button onClick={form.submit} disabled={form.saving}>
          {form.saving ? "Saving..." : "Create Employee"}
        </button>
      </section>

      {/* List */}
      <ul style={{ marginTop: "1rem" }}>
        {filtered.map((e, i) => (
          <li key={e.id || i}>
            {e.name} — {e.department}
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <p>No matches found.</p>}
    </main>
  );
}
