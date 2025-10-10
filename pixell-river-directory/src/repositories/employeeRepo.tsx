import type { Employee, Department } from "../types";

let employees: Employee[] = [
  { id: "e1", name: "Alice Wong", department: "Finance" },
  { id: "e2", name: "Dev Patel", department: "IT" },
];

function makeId(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8);
}

export const employeeRepo = {
  list(): Employee[] {
    // return a copy so outside code can't change the real array
    return [...employees];
  },
  create(name: string, department: Department): Employee {
    const newEmp: Employee = {
      id: makeId("e_"),
      name: name,
      department: department,
    };
    employees = [newEmp, ...employees];
    return newEmp;
  },
  // optional helpers if you need them later
  get(id: string) {
    return employees.find((e) => e.id === id);
  },
  remove(id: string) {
    employees = employees.filter((e) => e.id !== id);
  },
  clearAll() {
    employees = [];
  },
};
