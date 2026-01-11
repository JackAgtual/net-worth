import { Asset } from "./asset";

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset" });
  });

  describe("growthFromAppreciation", () => {
    it("undefined if contribution and amount one year ago are not set", () => {
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("undefined if only contributions is not set", () => {
      asset.amountOneYearAgo = 50;
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("undefined if only amountOneYearAgo is not set", () => {
      asset.contributions = 50;
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("calculated correctly", () => {
      asset.amountOneYearAgo = 50;
      asset.contributions = 10;
      expect(asset.growthFromAppreciation).toEqual(40);
    });
  });
});
