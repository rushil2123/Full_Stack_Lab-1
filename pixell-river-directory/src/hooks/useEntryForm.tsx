import { useState } from "react";
import type {
  EntryFormValues,
  EntryFormValuesEmployee,
  EntryFormValuesRole,
  EntryFormErrors,
} from "../types";
import { validStaffService } from "../services/validstaffService";
import { employeeRepo } from "../repositories/employeeRepo";
import { roleRepo } from "../repositories/orgRepo";

export function useEntryForm(kind: "employee" | "role") {
  const defaultEmp: EntryFormValuesEmployee = {
    kind: "employee",
    name: "",
    department: employeeRepo.departments()[0] || "",
  };
  const defaultRole: EntryFormValuesRole = {
    kind: "role",
    title: "",
    person: "",
    description: "",
  };

  const [values, setValues] = useState<EntryFormValues>(
    kind === "employee" ? defaultEmp : defaultRole
  );
  const [errors, setErrors] = useState<EntryFormErrors>({});
  const [saving, setSaving] = useState(false);

  function change(field: string, value: string) {
    setValues({ ...(values as any), [field]: value } as EntryFormValues);
    setErrors({ ...errors, [field]: undefined });
  }

  function submit() {
    const result = validStaffService.validate(values);
    setErrors(result.errors);
    if (!result.ok) return false;

    setSaving(true);
    try {
      if (values.kind === "employee") {
        const v = values as EntryFormValuesEmployee;
        employeeRepo.addEmployee(v.department, v.name.trim());
        setValues({ ...v, name: "" });
      } else {
        const v = values as EntryFormValuesRole;
        const t = v.title.trim();
        const p = v.person && v.person.trim() !== "" ? v.person.trim() : undefined;
        const d = v.description && v.description.trim() !== "" ? v.description.trim() : undefined;

        roleRepo.create(t, p, d);
        setValues({ ...v, title: "", person: "", description: "" });
      }
      return true;
    } finally {
      setSaving(false);
    }
  }

  function departments() {
    return employeeRepo.departments();
  }

  return { values, errors, saving, change, submit, departments };
}
