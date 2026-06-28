import {
  AssetGrowthChartData,
  CategoryChartData,
  ContributionAndWithdrawalAmountChartData,
  LiabilityPaymentsChart,
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

// shared between amount, percent, and cumulative contributions and withdrawals
const contributionAndWithdrawalsChartConfig = {
  [Contributor.All]: {
    label: "Total contributions",
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
  withdrawals: {
    label: "Withdrawals",
    color: "red",
  },
  netContributions: {
    label: "Net contributions",
    color: "gray",
  },
} satisfies StrictChartConfig<ContributionAndWithdrawalAmountChartData>;

const liabilityPaymentsChartConfig = {
  totalPaymentsMade: {
    label: "Total payments made",
    color: "black",
  },
  totalGrowthFromInterest: {
    label: "Total growth from interest",
    color: "red",
  },
} satisfies StrictChartConfig<LiabilityPaymentsChart>;

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
  ...contributionAndWithdrawalsChartConfig,
  ...categoryChartConfig,
  ...liabilityPaymentsChartConfig,
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
