import { useState } from "react";
import "./EmployeesPage.css";
import { employeeRepo } from "../repositories/employeeRepo";
import { useEntryForm } from "../hooks/useEntryForm";
import type { DepartmentGroup } from "../types";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const form = useEntryForm("employee");

  const groups: DepartmentGroup[] = employeeRepo.listGroups();

  const s = search.toLowerCase();
  const filtered = groups
    .map((g) => {
      const list = g.employees.filter(
        (n) =>
          n.toLowerCase().includes(s) ||
          g.department.toLowerCase().includes(s)
      );
      return { department: g.department, employees: list };
    })
    .filter((g) => g.employees.length > 0);

  return (
    <main>
      <h1>Employees</h1>
      <p className="greeting">Search employees and add new ones.</p>

      <label htmlFor="emp-search" className="sr-only">
        Search employees
      </label>
      <input
        id="emp-search"
        placeholder="Search by name or department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <section style={{ marginTop: "1rem" }}>
        <h2>Add Employee</h2>

        <div style={{ marginBottom: 8 }}>
          <label>
            Name
            <input
              value={(form.values.kind === "employee" && form.values.name) || ""}
              onChange={(e) => form.change("name", e.target.value)}
            />
          </label>
          {form.errors.name && <div role="alert">{form.errors.name}</div>}
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Department
            <select
              value={
                (form.values.kind === "employee" && form.values.department) || ""
              }
              onChange={(e) => form.change("department", e.target.value)}
            >
              {form.departments().map((d) => (
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

      <div style={{ marginTop: "1rem" }}>
        {filtered.map((g) => (
          <div key={g.department} className="dept-card">
            <h3>{g.department}</h3>
            <ul>
              {g.employees.map((name, i) => (
                <li key={name + i}>{name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p>No matches found.</p>}
    </main>
  );
}
