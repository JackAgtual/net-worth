import { User } from "@/generated/prisma/client";
import { getValidSessionOrRedirect } from "@/lib/auth/auth-utils";
import { prisma } from "@/lib/db/prisma";

export const nextRedirect = "NEXT_REDIRECT";

export async function createUser(): Promise<User> {
  const id = crypto.randomUUID();

  return prisma.user.create({
    data: { id, email: `${id}@gmail.com`, name: id },
  });
}

export async function createStatement(userId: string, year: number) {
  return prisma.statement.create({ data: { userId, year } });
}

export function mockSession(userId: string) {
  vi.mocked(getValidSessionOrRedirect).mockResolvedValue({
    user: { id: userId },
  } as never); // needed because I'm only checking for id
}

export function logout() {
  vi.mocked(getValidSessionOrRedirect).mockRejectedValue(
    new Error(nextRedirect)
  );
}
