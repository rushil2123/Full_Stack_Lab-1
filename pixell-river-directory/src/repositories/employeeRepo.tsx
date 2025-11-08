import type { DepartmentGroup } from "../types";
import { http } from "./http";

export async function listEmployees(search?: string): Promise<DepartmentGroup[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return http<DepartmentGroup[]>(`/employees${q}`);
}

export async function addEmployee(data: { name: string; department: string }): Promise<DepartmentGroup> {
  return http<DepartmentGroup>(`/employees`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}
