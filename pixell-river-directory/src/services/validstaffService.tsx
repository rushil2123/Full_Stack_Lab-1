import type { EntryFormValues, EntryFormErrors } from "../types";
import { roleRepo } from "../repositories/roleRepo";

export const validStaffService = {
  validate(values: EntryFormValues) {
    const errors: EntryFormErrors = {};

    // every name/title should be >= 3 chars
    if (!values.name || values.name.trim().length < 3) {
      errors.name = "Please enter at least 3 characters.";
    }

    // department check (UI should set this, but we still check)
    if (!values.department) {
      errors.department = "Please choose a department.";
    }

    // extra rule just for roles: can't create a role that's already filled
    if (values.kind === "role") {
      const title = values.name ? values.name.trim() : "";
      if (title && roleRepo.isTitleFilled(title)) {
        errors.name = "This role is already filled.";
      }
    }

    const ok = Object.keys(errors).length === 0;
    return { ok, errors };
  },
};
