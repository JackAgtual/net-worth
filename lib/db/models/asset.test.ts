import { Asset } from "./asset";

const userId = process.env.TEST_USER_ID as string;

describe("Asset", () => {
  let asset: InstanceType<typeof Asset>;

  beforeEach(() => {
    asset = new Asset({ amount: 100, title: "my asset", userId });
  });

  describe("growthFromAppreciation", () => {
    it("undefined if amountOneYearAgo is not set", () => {
      expect(asset.getGrowthFromAppreciation()).toBeUndefined();
    });

    it("defaults to zero contribution if contribution is not set", () => {
      asset.amountOneYearAgo = 50;

      expect(asset.getGrowthFromAppreciation()).toEqual(50);
    });

    it("undefined if amountOneYearAgo is not set", () => {
      asset.contribution = {
        self: 10,
      };

      expect(asset.getGrowthFromAppreciation()).toBeUndefined();
    });

    it("accounts for contributions made", () => {
      asset.amountOneYearAgo = 50;
      asset.contribution = {
        self: 5,
        nonSelf: 5,
      };
      expect(asset.getGrowthFromAppreciation()).toEqual(40);
    });
  });

  describe("totalContributions", () => {
    it("return zero if contributions are undefined", () => {
      expect(asset.getTotalContributions()).toEqual(0);
    });

    it("adds self and non self contributions", () => {
      asset.contribution = {
        self: 100,
        nonSelf: 200,
      };

      expect(asset.getTotalContributions()).toEqual(300);
    });
  });
});
