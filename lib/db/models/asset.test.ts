import { Asset } from "./asset";

const userId = process.env.TEST_USER_ID as string;

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset", userId });
  });

  describe("growthFromAppreciation", () => {
    it("undefined if amountOneYearAgo is not set", () => {
      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("defaults to zero contribution if contribution is not set", () => {
      asset.amountOneYearAgo = 50;

      expect(asset.growthFromAppreciation).toEqual(50);
    });

    it("undefined if amountOneYearAgo is not set", () => {
      asset.contribution = {
        amount: 10,
        selfContribution: true,
      };

      expect(asset.growthFromAppreciation).toBeUndefined();
    });

    it("accounts for contributions made", () => {
      asset.amountOneYearAgo = 50;
      asset.contribution = {
        amount: 10,
        selfContribution: true,
      };
      expect(asset.growthFromAppreciation).toEqual(40);
    });
  });
});
