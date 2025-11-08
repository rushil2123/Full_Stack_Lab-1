// src/repositories/employeeRepo.ts
import { http } from "./http";
import type { DepartmentGroup } from "../types";

// Backend row shape (what the API returns)
type EmployeeRow = {
  id: number;
  name: string;
  department: string;
  createdAt: string; // ISO
};

export async function listEmployees(search?: string): Promise<DepartmentGroup[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const rows = await http<EmployeeRow[]>(`/employees${q}`);

  // Group by department to match DepartmentGroup
  const byDept = new Map<string, EmployeeRow[]>();
  for (const r of rows) {
    if (!byDept.has(r.department)) byDept.set(r.department, []);
    byDept.get(r.department)!.push(r);
  }

  // Build DepartmentGroup[]
  // - id: use the MIN employee id in the department (stable)
  // - createdAt: earliest createdAt among members
  const groups: DepartmentGroup[] = [];
  for (const [department, members] of byDept.entries()) {
    const id = Math.min(...members.map(m => m.id));
    const createdAt = members
      .map(m => m.createdAt)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))[0];

    groups.push({
      id,
      department,
      employees: members.map(m => m.name),
      createdAt
    });
  }

  // Optional: sort groups by department asc for consistency
  groups.sort((a, b) => a.department.localeCompare(b.department));
  return groups;
}

export async function addEmployee(data: { name: string; department: string }) {
  // we don't need the return type elsewhere; the page will refresh after POST
  return http<EmployeeRow>(`/employees`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}
