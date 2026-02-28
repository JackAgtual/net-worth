import { isPlainObject } from "lodash";

function isRecord(value: unknown): value is Record<string, unknown> {
  return isPlainObject(value);
}

export function deepObjectEntries(
  obj: Record<string, unknown>,
  path: string = ""
): [string, unknown][] {
  const deepEntries: [string, unknown][] = [];
  const entries = Object.entries(obj);

  for (const [key, val] of entries) {
    const curPath = path ? `${path}.${key}` : key;
    if (isRecord(val)) {
      deepEntries.push(...deepObjectEntries(val, curPath));
    } else {
      deepEntries.push([curPath, val]);
    }
  }

  return deepEntries;
}
