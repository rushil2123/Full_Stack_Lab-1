import type { Employee, Department } from "../types";

const KEY = "prf_employees_v1";

function load(): Employee[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors and fall back to seed data
  }
  // seed data (shown on first run)
  return [
    { id: "e1", name: "Alice Wong", department: "Finance" },
    { id: "e2", name: "Dev Patel", department: "IT" },
  ];
}

function save(list: Employee[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

let employees: Employee[] = load();

function makeId(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8);
}

export const employeeRepo = {
  list(): Employee[] {
    return [...employees]; // return a copy
  },

  create(name: string, department: Department): Employee {
    const newEmp: Employee = { id: makeId("e_"), name: name.trim(), department };
    employees = [newEmp, ...employees];
    save(employees);
    return newEmp;
  },

  // optional helpers if you need them later
  get(id: string) {
    return employees.find((e) => e.id === id);
  },

  remove(id: string) {
    employees = employees.filter((e) => e.id !== id);
    save(employees);
  },

  clearAll() {
    employees = [];
    save(employees);
  },
};
