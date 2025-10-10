import type { Role, Department } from "../types";

const KEY = "prf_roles_v1";

function load(): Role[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors and fall back to seed data
  }
  // seed data (shown on first run)
  return [
    { id: "r1", title: "Controller", department: "Finance", person: "Alice Wong" },
    { id: "r2", title: "Systems Analyst", department: "IT" },
  ];
}

function save(list: Role[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

let roles: Role[] = load();

function makeId(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8);
}

export const roleRepo = {
  list(): Role[] {
    return [...roles];
  },

  create(title: string, department: Department, person?: string): Role {
    const cleanTitle = title.trim();
    const cleanPerson = person && person.trim() !== "" ? person.trim() : undefined;
    const newRole: Role = { id: makeId("r_"), title: cleanTitle, department, person: cleanPerson };
    roles = [newRole, ...roles];
    save(roles);
    return newRole;
  },

  isTitleFilled(title: string): boolean {
    const found = roles.find((r) => r.title.toLowerCase() === title.toLowerCase());
    return !!(found && found.person && found.person.trim().length > 0);
  },

  // optional helpers
  get(id: string) {
    return roles.find((r) => r.id === id);
  },

  remove(id: string) {
    roles = roles.filter((r) => r.id !== id);
    save(roles);
  },

  clearAll() {
    roles = [];
    save(roles);
  },
};
