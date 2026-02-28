import { deepObjectEntries } from "./object-utils";

describe("deepObjectEntries", () => {
  it("deeply creates object entries", () => {
    const obj = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
      },
      f: {
        g: 5,
        h: {
          i: 6,
        },
      },
    };
    const entries = deepObjectEntries(obj);

    expect(entries).toEqual([
      ["a", 1],
      ["b", 2],
      ["c.d", 3],
      ["c.e", 4],
      ["f.g", 5],
      ["f.h.i", 6],
    ]);
    console.log(entries);
  });
});
