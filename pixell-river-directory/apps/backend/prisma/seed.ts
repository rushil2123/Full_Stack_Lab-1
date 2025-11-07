import { PrismaClient } from "@prisma/client";
import employees from "./data/employees.json";
import roles from "./data/org.json";

const prisma = new PrismaClient();

async function main() {
  // employees.json: [{ department: string; employees: string[] }, ...]
  for (const group of employees as Array<{ department: string; employees: string[] }>) {
    for (const name of group.employees) {
      await prisma.employee.create({ data: { name, department: group.department } });
    }
  }

  // org.json: [{ title: string; person?: string; description?: string }, ...]
  for (const r of roles as Array<{ title: string; person?: string; description?: string }>) {
    await prisma.role.create({
      data: { title: r.title, person: r.person ?? null, description: r.description ?? null }
    });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
