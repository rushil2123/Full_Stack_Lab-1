import type { OrgRole } from "../types";
import { http } from "./http";

export async function listRoles(search?: string): Promise<OrgRole[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  return http<OrgRole[]>(`/roles${q}`);
}

export async function addRole(data: { title: string; person?: string; description?: string }): Promise<OrgRole> {
  return http<OrgRole>(`/roles`, {
    method: "POST",
    body: JSON.stringify(data)
  });
}

// Optional: keep this if your frontend validation calls it
export async function isTitleFilled(title: string): Promise<boolean> {
  const rows = await listRoles(title);
  return rows.some(r => r.title.toLowerCase() === title.toLowerCase() && !!r.person);
}
