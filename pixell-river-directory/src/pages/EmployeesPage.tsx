import { useEffect, useState } from "react";
import * as employeesRepo from "../repositories/employeeRepo";
import type { DepartmentGroup } from "../types";

export default function EmployeesPage() {
  const [rows, setRows] = useState<DepartmentGroup[]>([]);
  const [search, setSearch] = useState("");

  const refresh = async (term?: string) => {
    const data = await employeesRepo.listEmployees(term);
    setRows(data);
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

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    await refresh(term);
  };

  return (
    <>
      <input
        placeholder="Search employees or departments"
        value={search}
        onChange={onSearchChange}
      />
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Full name" />
        <input name="department" placeholder="Department" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {rows.map((r) => (
          <li key={`${r.department}:${r.employees}`}>{r.employees} — {r.department}</li>
        ))}
      </ul>
    </>
  );
}
