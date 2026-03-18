import {
  AssetGrowthChartData,
  CategoryChartData,
  ContributionAmountChartData,
  NetWorthChartData,
} from "@/lib/types/chart-data-types";
import { Category, Contributor } from "@/lib/types/types";
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

const categoryChartConfig = {
  [Category.AfterTax]: {
    color: "#1D4ED8",
    label: Category.AfterTax,
  },
  [Category.Cash]: {
    color: "green",
    label: Category.Cash,
  },
  [Category.Property]: {
    color: "gray",
    label: Category.Property,
  },
  [Category.TaxDeferred]: {
    color: "#F59E0B",
    label: Category.TaxDeferred,
  },
  [Category.TaxFree]: {
    color: "#8B5CF6",
    label: Category.TaxFree,
  },
} satisfies StrictChartConfig<CategoryChartData>;

export const chartConfig = {
  ...netWorthChartConfig,
  ...assetGrowthChartConfig,
  ...contributionChartConfig,
  ...categoryChartConfig,
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
