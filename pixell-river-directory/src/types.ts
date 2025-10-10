export interface DepartmentGroup {
  department: string;
  employees: string[];
}

export interface OrgRole {
  title: string;        
  person: string;       
  description?: string; 
}

export type Department = "Finance" | "HR" | "IT" | "Operations" | "Sales";

export interface Employee {
  id: string;
  name: string;
  department: Department;
}

export interface Role {
  id: string;
  title: string;
  department: Department;
  person?: string; // if empty => role not filled
}

export interface EntryFormValues {
  kind: "employee" | "role";
  name: string;        // for employee: employee name, for role: role title
  department: Department;
  person?: string;     // only used when kind === "role"
}

export type EntryFormErrors = {
  name?: string;
  department?: string;
};
