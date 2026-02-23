import {
  AssetGrowthChartData,
  ContributionAmountChartData,
  ContributionPercentChartData,
  NetWorthChartData,
} from "@/lib/types/chart-data-types";
import { ChartConfig } from "../ui/chart";

type ChartConfigItem = ChartConfig[string];
type StrictChartConfig<T> = {
  [K in Exclude<keyof T, "year">]: ChartConfigItem;
};

const netWorthChartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "black",
  },
  totalAssetAmount: {
    label: "Assets",
    color: "blue",
  },
  totalLiabilityAmount: {
    label: "Liabilities",
    color: "red",
  },
} satisfies StrictChartConfig<NetWorthChartData>;

const assetGrowthChartConfig = {
  lastYearSalary: {
    label: "Last year salary",
    color: "gray",
  },
  lastYearAssetGrowth: {
    label: "Last year asset growth",
    color: "green",
  },
} satisfies StrictChartConfig<AssetGrowthChartData>;

const contributionAmountChartConfig = {
  totalContributionAmount: {
    label: "Total contributions",
    color: "black",
  },
  selfContributionAmount: {
    label: "Self contributions",
    color: "blue",
  },
  nonSelfContributionAmount: {
    label: "Non-self contributions",
    color: "orange",
  },
} satisfies StrictChartConfig<ContributionAmountChartData>;

const contributionPercentOfSalaryChartConfig = {
  totalContributionPct: {
    label: "Total contributions percent of salary",
    color: "black",
  },
  selfContributionPct: {
    label: "Self contributions percent of salary",
    color: "blue",
  },
  nonSelfContributionPct: {
    label: "Non-self contributions percent of salary",
    color: "orange",
  },
} satisfies StrictChartConfig<ContributionPercentChartData>;

export const chartConfig = {
  ...netWorthChartConfig,
  ...assetGrowthChartConfig,
  ...contributionAmountChartConfig,
  ...contributionPercentOfSalaryChartConfig,
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
