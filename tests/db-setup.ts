import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "@/generated/prisma/client";

export const pglite = new PGlite();
export const testPrisma = new PrismaClient({
  adapter: new PrismaPGlite(pglite),
});

async function applyMigrations() {
  const dir = join(process.cwd(), "prisma", "migrations");
  const folders = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const folder of folders) {
    await pglite.exec(readFileSync(join(dir, folder, "migration.sql"), "utf8"));
  }
}

async function resetDb() {
  const { rows } = await pglite.query<{ tablename: string }>(
    `select tablename from pg_tables where schemaname = 'public'`
  );
  if (rows.length === 0) return;
  const tables = rows.map((r) => `"${r.tablename}"`).join(", ");
  await pglite.exec(`TRUNCATE ${tables} RESTART IDENTITY CASCADE`);
}

async function closeDb() {
  await testPrisma.$disconnect();
  await pglite.close();
}

export function setupTestDb() {
  beforeAll(applyMigrations);
  beforeEach(resetDb);
  afterAll(closeDb);
}
