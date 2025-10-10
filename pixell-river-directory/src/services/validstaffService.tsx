import type { EntryFormValues, EntryFormErrors } from "../types";
import { roleRepo } from "../repositories/orgRepo";

export const validStaffService = {
  validate(values: EntryFormValues) {
    const errors: EntryFormErrors = {};

    if (values.kind === "employee") {
      if (!values.name || values.name.trim().length < 3) {
        errors.name = "Please enter at least 3 characters.";
      }
      if (!values.department || values.department.trim() === "") {
        errors.department = "Please choose a department.";
      }
    }

    if (values.kind === "role") {
      if (!values.title || values.title.trim().length < 3) {
        errors.title = "Please enter at least 3 characters.";
      }
      // can't create a role that's already filled
      const t = values.title ? values.title.trim() : "";
      if (t && roleRepo.isTitleFilled(t)) {
        errors.title = "This role is already filled.";
      }
    }

    const ok = Object.keys(errors).length === 0;
    return { ok, errors };
  },
};
