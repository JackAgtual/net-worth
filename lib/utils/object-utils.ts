type ResolvedObject<T> = {
  [K in keyof T]: T[K] extends Promise<infer U>
    ? U
    : T[K] extends object
      ? ResolvedObject<T[K]>
      : T[K];
};

function isPromise(val: unknown): val is Promise<any> {
  return val instanceof Promise;
}

function isObject(val: unknown) {
  return val !== null && typeof val === "object" && !Array.isArray(val);
}

export async function deepResolveObject<T extends Record<string, any>>(
  obj: T
): Promise<ResolvedObject<T>> {
  const keys = Object.keys(obj) as Array<keyof T>;

  const values = await Promise.all(
    keys.map(async (key) => {
      const value = obj[key];

      if (isPromise(value)) {
        return await value;
      }

      if (isObject(value)) {
        return await deepResolveObject(value);
      }

      return value;
    })
  );

  return Object.fromEntries(
    keys.map((key, i) => [key, values[i]])
  ) as ResolvedObject<T>;
}
