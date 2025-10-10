import type { DepartmentGroup } from "../types";
import employeesSeed from "../data/employees.json";

const EMP_KEY = "prf_employees_groups_v1";

function load(): DepartmentGroup[] {
  try {
    const raw = localStorage.getItem(EMP_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {

  }

  const seed: DepartmentGroup[] = employeesSeed as DepartmentGroup[];
  localStorage.setItem(EMP_KEY, JSON.stringify(seed));
  return seed;
}

function save(groups: DepartmentGroup[]) {
  localStorage.setItem(EMP_KEY, JSON.stringify(groups));
}

let groups: DepartmentGroup[] = load();

export const employeeRepo = {
  listGroups(): DepartmentGroup[] {
    return [...groups].map(g => ({ department: g.department, employees: [...g.employees] }));
  },

  departments(): string[] {
    return groups.map(g => g.department);
  },

  addEmployee(department: string, name: string) {
    const dept = groups.find(g => g.department === department);
    if (dept) {
      dept.employees = [name.trim(), ...dept.employees];
    } else {
      groups = [{ department, employees: [name.trim()] }, ...groups];
    }
    save(groups);
  },

  removeEmployee(department: string, name: string) {
    const dept = groups.find(g => g.department === department);
    if (!dept) return;
    dept.employees = dept.employees.filter(n => n !== name);
    save(groups);
  },

  clearAll() {
    groups = [];
    save(groups);
  },
};
