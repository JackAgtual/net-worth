export type NetWorthChartData = {
  year: number;
  netWorth: number;
  totalAssetAmount: number;
  totalLiabilityAmount: number;
};

export type AssetGrowthChartData = {
  year: number;
  lastYearSalary: number | undefined;
  lastYearAssetGrowth: number;
};

export type ContributionAmountChartData = {
  year: number;
  totalContributionAmount: number;
  selfContributionAmount: number;
  nonSelfContributionAmount: number;
};

export type ContributionPercentChartData = {
  year: number;
  totalContributionPct: number | undefined;
  selfContributionPct: number | undefined;
  nonSelfContributionPct: number | undefined;
};
