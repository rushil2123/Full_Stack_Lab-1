// src/services/validstaffService.tsx
import * as orgRepo from "../repositories/orgRepo";

export type ErrorMap = Record<string, string>;

export function validateEmployee(values: {
  name?: string;
  department?: string;
}): ErrorMap {
  const errors: ErrorMap = {};
  const name = (values.name ?? "").trim();
  const department = (values.department ?? "").trim();

  if (!name) errors.name = "Name is required";
  else if (name.length < 3) errors.name = "Name must be at least 3 characters";

  if (!department) errors.department = "Department is required";
  else if (department.length < 2) errors.department = "Department must be at least 2 characters";

  return errors;
}

export function validateRole(values: {
  title?: string;
  person?: string;
  description?: string;
}): ErrorMap {
  const errors: ErrorMap = {};
  const title = (values.title ?? "").trim();
  const person = (values.person ?? "").trim();
  const description = (values.description ?? "").trim();

  if (!title) errors.title = "Title is required";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters";

  // person/description are optional in UI; enforce min length only if provided
  if (person && person.length < 3) errors.person = "Person must be at least 3 characters";
  if (description && description.length < 3) errors.description = "Description must be at least 3 characters";

  return errors;
}

/**
 * Optional: async preflight that checks if the role title is already filled via API.
 * Use this only if you want to show a nicer client-side error before POSTing.
 */
export async function validateRoleAsync(values: {
  title?: string;
  person?: string;
  description?: string;
}): Promise<ErrorMap> {
  const errors = validateRole(values);
  const title = (values.title ?? "").trim();

  if (!errors.title && title) {
    try {
      const filled = await orgRepo.isTitleFilled(title);
      if (filled) errors.title = "This role title is already filled";
    } catch {
      // If the API check fails, skip this hint and let the POST handle it.
    }
  }
  return errors;
}
