// src/pages/EmployeesPage.tsx
import { useEffect, useState } from "react";
import * as employeesRepo from "../repositories/employeeRepo";
import type { DepartmentGroup } from "../types";

export default function EmployeesPage() {
  const [groups, setGroups] = useState<DepartmentGroup[]>([]);
  const [search, setSearch] = useState("");

  const refresh = async (term?: string) => {
    const data = await employeesRepo.listEmployees(term);
    setGroups(data);
  };

  useEffect(() => { refresh(); }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const department = String(form.get("department") || "").trim();
    if (!name || !department) return;

    await employeesRepo.addEmployee({ name, department });
    (e.currentTarget as HTMLFormElement).reset();
    await refresh(search);
  };

  return (
    <>
      <input
        placeholder="Search employees or departments"
        value={search}
        onChange={async (e) => {
          const term = e.target.value;
          setSearch(term);
          await refresh(term);
        }}
      />

      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Full name" />
        <input name="department" placeholder="Department" />
        <button type="submit">Add</button>
      </form>

      {groups.map(g => (
        <section key={g.id}>
          <h3>{g.department}</h3>
          <ul>
            {g.employees.map((n, i) => (
              <li key={`${g.id}:${i}`}>{n}</li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
