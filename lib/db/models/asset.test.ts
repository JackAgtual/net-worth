import { Asset } from "./asset";

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset" });
  });

  describe("growthFromAppreciation", () => {
    it("undefined if deltaAmount is not set", () => {
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("calculated correctly", () => {
      asset.deltaAmount = {
        amountOneYearAgo: 50,
        contributions: 10,
        selfContribution: true,
      };
      expect(asset.growthFromAppreciation).toEqual(40);
    });
  });
});
