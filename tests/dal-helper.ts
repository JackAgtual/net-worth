import { Statement } from "@/lib/db/models";
import { checkSession } from "@/lib/auth/auth-utils";

export const USER_A = "user-aaa";
export const USER_B = "user-bbb";

export async function createStatement(userId: string, year: number) {
  return Statement.create({
    userId,
    year,
    lastYearSalary: 50000,
    assets: [],
    liabilities: [],
  });
}

export function mockSession(userId: string) {
  const mockCheckSession = checkSession as jest.MockedFunction<
    typeof checkSession
  >;
  mockCheckSession.mockResolvedValue({ user: { id: userId } } as any);
}
