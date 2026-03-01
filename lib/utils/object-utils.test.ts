import { deepResolveObject } from "./object-utils";

describe("deepResolveObject", () => {
  it("resolves correct values", async () => {
    const obj = {
      netWorth: Promise.resolve(400),
      assets: Promise.resolve(500),
      liabilities: Promise.resolve(100),
      contributions: {
        percent: {
          self: Promise.resolve(0.4),
          nonSelf: Promise.resolve(0.1),
          total: Promise.resolve(0.5),
        },
        amount: {
          self: Promise.resolve(400),
          nonSelf: Promise.resolve(100),
          total: Promise.resolve(500),
        },
      },
    };

    const resolvedObj = await deepResolveObject(obj);

    expect(resolvedObj).toEqual({
      netWorth: 400,
      assets: 500,
      liabilities: 100,
      contributions: {
        percent: {
          self: 0.4,
          nonSelf: 0.1,
          total: 0.5,
        },
        amount: {
          self: 400,
          nonSelf: 100,
          total: 500,
        },
      },
    });
  });

  it("resolves nested promises in parallel (not sequentially)", async () => {
    const executionLog: string[] = [];

    const createMockPromise = (name: string, delay: number) =>
      new Promise((resolve) => {
        executionLog.push(`${name} started`);
        setTimeout(() => {
          executionLog.push(`${name} finished`);
          resolve(name);
        }, delay);
      });

    const obj = {
      first: createMockPromise("first", 50),
      second: {
        nested: createMockPromise("nested", 50),
      },
    };

    await deepResolveObject(obj);

    expect(executionLog[0]).toBe("first started");
    expect(executionLog[1]).toBe("nested started");

    expect(executionLog).toContain("first finished");
    expect(executionLog).toContain("nested finished");
  });
});
