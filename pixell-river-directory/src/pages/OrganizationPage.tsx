import { useEffect, useState } from "react";
import * as rolesRepo from "../repositories/orgRepo";
import type { OrgRole } from "../types";

export default function OrganizationPage() {
  const [rows, setRows] = useState<OrgRole[]>([]);
  const [search, setSearch] = useState("");

  const refresh = async (term?: string) => {
    const data = await rolesRepo.listRoles(term);
    setRows(data);
  };

  useEffect(() => { refresh(); }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const person = String(form.get("person") || "").trim() || undefined;
    const description = String(form.get("description") || "").trim() || undefined;
    if (!title) return;

    // Optional UX rule from Lab 3
    // if (await rolesRepo.isTitleFilled(title)) { alert("Title already filled"); return; }

    await rolesRepo.addRole({ title, person, description });
    (e.currentTarget as HTMLFormElement).reset();
    await refresh(search);
  };

  const onSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    await refresh(term);
  };

  return (
    <>
      <input
        placeholder="Search roles, people, or descriptions"
        value={search}
        onChange={onSearchChange}
      />
      <form onSubmit={onSubmit}>
        <input name="title" placeholder="Title (e.g., CTO)" />
        <input name="person" placeholder="Person (optional)" />
        <input name="description" placeholder="Description (optional)" />
        <button type="submit">Add</button>
      </form>

      <ul>
        {rows.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong>
            {r.person ? ` — ${r.person}` : ""} {r.description ? ` — ${r.description}` : ""}
          </li>
        ))}
      </ul>
    </>
  );
}
