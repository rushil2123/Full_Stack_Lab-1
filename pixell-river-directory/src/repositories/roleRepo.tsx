import type { Role, Department } from "../types";

let roles: Role[] = [
  { id: "r1", title: "Controller", department: "Finance", person: "Alice Wong" },
  { id: "r2", title: "Systems Analyst", department: "IT" }, // unfilled role
];

function makeId(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8);
}

export const roleRepo = {
  list(): Role[] {
    return [...roles];
  },
  create(title: string, department: Department, person?: string): Role {
    const cleanPerson = person && person.trim() !== "" ? person.trim() : undefined;
    const newRole: Role = {
      id: makeId("r_"),
      title: title,
      department: department,
      person: cleanPerson,
    };
    roles = [newRole, ...roles];
    return newRole;
  },
  isTitleFilled(title: string): boolean {
    const found = roles.find(
      (r) => r.title.toLowerCase() === title.toLowerCase()
    );
    if (!found) return false;
    return !!(found.person && found.person.trim().length > 0);
  },
  // optional helpers
  get(id: string) {
    return roles.find((r) => r.id === id);
  },
  remove(id: string) {
    roles = roles.filter((r) => r.id !== id);
  },
  clearAll() {
    roles = [];
  },
};
