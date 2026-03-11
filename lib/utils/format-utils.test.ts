import { formatAsDollar, formatAsPercent } from "./format-utils";

describe("formatAsDollar", () => {
  it("returns empty string for null or undefined", () => {
    expect(formatAsDollar(null)).toEqual("");
    expect(formatAsDollar(undefined)).toEqual("");
  });

  it("renders $- for zero", () => {
    expect(formatAsDollar(0)).toEqual("$-");
  });

  it("adds parenthesis for negative numbers", () => {
    expect(formatAsDollar(-100)).toEqual("($100)");
  });

  it("shows 2 decimal places and parenthesis for negative non integer", () => {
    expect(formatAsDollar(-1.123456)).toEqual("($1.12)");
    expect(formatAsDollar(-1.8)).toEqual("($1.80)");
    expect(formatAsDollar(-99.77)).toEqual("($99.77)");
  });

  it("show 2 decimal places for non integers", () => {
    expect(formatAsDollar(1.123456)).toEqual("$1.12");
    expect(formatAsDollar(1.8)).toEqual("$1.80");
    expect(formatAsDollar(99.77)).toEqual("$99.77");
  });

  it("shows no decimal for integer", () => {
    expect(formatAsDollar(123)).toEqual("$123");
  });

  it("renders comma every 3 digits", () => {
    expect(formatAsDollar(1234567)).toEqual("$1,234,567");
  });

  it("can render numbers in compact notation", () => {
    expect(formatAsDollar(1200000, true)).toEqual("$1.2M");
    expect(formatAsDollar(9800, true)).toEqual("$9.8K");
    expect(formatAsDollar(1000, true)).toEqual("$1K");
    expect(formatAsDollar(-1800, true)).toEqual("($1.8K)");
  });

  it("can render floating point numbers in compact notation (without a decimal)", () => {
    expect(formatAsDollar(800500.44, true)).toEqual("$801K");
  });
});

describe("formatAsPercent", () => {
  it("returns 0% for undefined input", () => {
    expect(formatAsPercent(undefined)).toEqual("0%");
  });

  it("returns percent as integer", () => {
    expect(formatAsPercent(0.384)).toEqual("38%");
    expect(formatAsPercent(0.3999)).toEqual("40%");
  });

  it("handles inputs greater than 1", () => {
    expect(formatAsPercent(2.3)).toEqual("230%");
  });

  it("handles negative numbers", () => {
    expect(formatAsPercent(-0.32)).toEqual("-32%");
  });
});
