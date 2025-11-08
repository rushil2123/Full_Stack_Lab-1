import { useState } from "react";
import * as employeeRepo from "../repositories/employeeRepo";
import * as orgRepo from "../repositories/orgRepo";
import { validateEmployee, validateRoleAsync } from "../services/validstaffService";

type FormType = "employee" | "role";

interface UseEntryFormReturn<T> {
  values: T;
  errors: Record<string, string>;
  saving: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

/**
 * Shared hook for both Employee and Role forms
 */
export function useEntryForm<T extends Record<string, any>>(type: FormType): UseEntryFormReturn<T> {
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setValues({});
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (type === "employee") {
        const err = await validateEmployee(values);
        if (Object.keys(err).length) {
          setErrors(err);
          setSaving(false);
          return;
        }

        await employeeRepo.addEmployee({
          name: values.name.trim(),
          department: values.department.trim()
        });
      }

      if (type === "role") {
        const err = await validateRoleAsync(values);
        if (Object.keys(err).length) {
          setErrors(err);
          setSaving(false);
          return;
        }

        await orgRepo.addRole({
          title: values.title.trim(),
          person: values.person?.trim() || undefined,
          description: values.description?.trim() || undefined
        });
      }

      resetForm();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return { values, errors, saving, handleChange, handleSubmit, resetForm };
}
