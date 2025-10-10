import { useState } from "react";
import type { Department, EntryFormValues, EntryFormErrors } from "../types";
import { validStaffService } from "../services/validstaffService";
import { employeeRepo } from "../repositories/employeeRepo";
import { roleRepo } from "../repositories/roleRepo";

const DEPARTMENTS: Department[] = ["Finance", "HR", "IT", "Operations", "Sales"];

export function useEntryForm(kind: "employee" | "role") {
  const [values, setValues] = useState<EntryFormValues>({
    kind: kind,
    name: "",
    department: DEPARTMENTS[0],
    person: "",
  });

  const [errors, setErrors] = useState<EntryFormErrors>({});
  const [saving, setSaving] = useState(false);

  function change(field: keyof EntryFormValues, value: string) {
    // simple set: keep code easy to read
    setValues({ ...values, [field]: value });
    // clear that field's error when user types
    setErrors({ ...errors, [field]: undefined });
  }

  function submit() {
    const result = validStaffService.validate(values);
    setErrors(result.errors);

    if (!result.ok) {
      return false; // stop if errors
    }

    setSaving(true);
    try {
      if (values.kind === "employee") {
        employeeRepo.create(values.name.trim(), values.department);
      } else {
        const title = values.name.trim();
        const who =
          values.person && values.person.trim() !== "" ? values.person.trim() : undefined;
        roleRepo.create(title, values.department, who);
      }
      // reset text fields (keep department the same so user doesn't re-pick)
      setValues({ ...values, name: "", person: "" });
      return true;
    } finally {
      setSaving(false);
    }
  }

  return {
    values,
    errors,
    saving,
    change,
    submit,
    departments: DEPARTMENTS,
  };
}
