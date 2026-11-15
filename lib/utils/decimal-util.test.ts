import { Decimal } from "@prisma/client/runtime/client";
import { toDecimal } from "./decimal-utils";

describe("toDecimal", () => {
  it("returns 0 if null", () => {
    expect(toDecimal(null)).toEqual(Decimal(0));
  });

  it("returns save value if not null", () => {
    expect(toDecimal(Decimal(1.3))).toEqual(Decimal(1.3));
  });
});
