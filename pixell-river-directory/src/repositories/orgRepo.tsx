// src/repositories/orgRepo.ts
import { http } from "./http";
import type { OrgRole } from "../types";

// Backend row shape matches OrgRole fields
type RoleRow = {
  id: number;
  title: string;
  person?: string | null;
  description?: string | null;
  createdAt: string;
};

export async function listRoles(search?: string): Promise<OrgRole[]> {
  const q = search ? `?search=${encodeURIComponent(search)}` : "";
  const rows = await http<RoleRow[]>(`/roles${q}`);

  // Map nulls to undefined to fit OrgRole
  return rows.map(r => ({
    id: r.id,
    title: r.title,
    person: r.person ?? undefined,
    description: r.description ?? undefined,
    createdAt: r.createdAt
  }));
}

export async function addRole(data: {
  title: string;
  person?: string;
  description?: string;
}): Promise<OrgRole> {
  const r = await http<RoleRow>(`/roles`, {
    method: "POST",
    body: JSON.stringify(data)
  });

  return {
    id: r.id,
    title: r.title,
    person: r.person ?? undefined,
    description: r.description ?? undefined,
    createdAt: r.createdAt
  };
}

// Optional helper if your UI calls it
export async function isTitleFilled(title: string): Promise<boolean> {
  const rows = await listRoles(title);
  return rows.some(r => r.title.toLowerCase() === title.toLowerCase() && !!r.person);
}
