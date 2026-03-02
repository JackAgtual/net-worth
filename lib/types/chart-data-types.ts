import { Contributor } from "./types";

type Year = { year: number };

export type NetWorthChartData = Year & {
  netWorth: number;
  totalAssetAmount: number;
  totalLiabilityAmount: number;
};

export type AssetGrowthChartData = Year & {
  lastYearSalary: number | undefined;
  lastYearAssetGrowth: number;
};

export type ContributionValues<T = number> = Record<Contributor, T>;

export type ContributionAmountChartData = Year & ContributionValues;

export type ContributionPercentChartData = Year &
  ContributionValues<number | undefined>;
