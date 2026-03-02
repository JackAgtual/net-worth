import {
  AssetGrowthChartData,
  ContributionAmountChartData,
  ContributionPercentChartData,
  NetWorthChartData,
} from "@/lib/types/chart-data-types";
import { ChartConfig } from "../ui/chart";
import { Contributor } from "@/lib/types/types";

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

// shared between amount, percent, and cumulative contributions
const contributionChartConfig = {
  [Contributor.All]: {
    label: "Total",
    color: "black",
  },
  [Contributor.Self]: {
    label: "Self",
    color: "blue",
  },
  [Contributor.NonSelf]: {
    label: "Non-self",
    color: "orange",
  },
} satisfies StrictChartConfig<ContributionAmountChartData>;

export const chartConfig = {
  ...netWorthChartConfig,
  ...assetGrowthChartConfig,
  ...contributionChartConfig,
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
