import { getValidSessionOrRedirect } from "@/lib/auth/auth-utils";
import { prisma } from "@/lib/db/prisma";

export const USER_A = "user-aaa";
export const USER_B = "user-bbb";

export async function createUser() {
  const id = crypto.randomUUID();

  return prisma.user.create({
    data: { id, email: `${id}@gmail.com`, name: id },
  });
}

export function mockSession(userId: string) {
  vi.mocked(getValidSessionOrRedirect).mockResolvedValue({
    user: { id: userId },
  } as never); // needed because I'm only checking for id
}
