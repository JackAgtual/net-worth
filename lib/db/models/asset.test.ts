import { Asset } from "./asset";

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset" });
  });

  describe("growthFromAppreciation", () => {
    it("undefined if contribution and amountOneYearAgo are not set", () => {
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("undefined if contribution is not set", () => {
      asset.amountOneYearAgo = 50;

      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("undefined if amountOneYearAgo is not set", () => {
      asset.contribution = {
        contributions: 10,
        selfContribution: true,
      };

      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("calculated correctly", () => {
      asset.amountOneYearAgo = 50;
      asset.contribution = {
        contributions: 10,
        selfContribution: true,
      };
      expect(asset.growthFromAppreciation).toEqual(40);
    });
  });
});
