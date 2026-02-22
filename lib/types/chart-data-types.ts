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
