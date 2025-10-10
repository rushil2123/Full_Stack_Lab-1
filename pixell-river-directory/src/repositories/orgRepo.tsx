import type { OrgRole } from "../types";
import rolesSeed from "../data/org.json";

const ROLES_KEY = "prf_org_v1";

function load(): OrgRole[] {
  try {
    const raw = localStorage.getItem(ROLES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
  
  }
  const seed: OrgRole[] = rolesSeed as OrgRole[];
  localStorage.setItem(ROLES_KEY, JSON.stringify(seed));
  return seed;
}

function save(list: OrgRole[]) {
  localStorage.setItem(ROLES_KEY, JSON.stringify(list));
}

let roles: OrgRole[] = load();


function normalizeTitle(t: string) {
  return t.trim().toLowerCase();
}

export const roleRepo = {
  list(): OrgRole[] {
    return [...roles].map(r => ({ ...r }));
  },


  create(title: string, person?: string, description?: string) {
    const cleanTitle = title.trim();
    const cleanPerson = person && person.trim() !== "" ? person.trim() : undefined;
    const cleanDesc = description && description.trim() !== "" ? description.trim() : undefined;
    const item: OrgRole = { title: cleanTitle, person: cleanPerson, description: cleanDesc };
    roles = [item, ...roles];
    save(roles);
    return item;
  },

  isTitleFilled(title: string): boolean {
    const t = normalizeTitle(title);
    const found = roles.find(r => normalizeTitle(r.title) === t);
    return !!(found && found.person && found.person.trim().length > 0);
  },

  removeByTitleFirstMatch(title: string) {
    const t = normalizeTitle(title);
    const idx = roles.findIndex(r => normalizeTitle(r.title) === t);
    if (idx >= 0) {
      roles.splice(idx, 1);
      save(roles);
    }
  },

  clearAll() {
    roles = [];
    save(roles);
  },
};
