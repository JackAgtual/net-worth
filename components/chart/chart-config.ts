import {
  AssetGrowthChartData,
  CategoryChartData,
  ContributionAndWithdrawalAmountChartData,
  LiabilityPaymentsChart,
  NetWorthChartData,
} from "@/lib/types/chart-data-types";
import { Contributor } from "@/lib/types/types";
import { ChartConfig } from "../ui/chart";
import { AssetCategory } from "@/generated/prisma/enums";

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
  [AssetCategory.AFTER_TAX]: {
    color: "#1D4ED8",
    label: AssetCategory.AFTER_TAX,
  },
  [AssetCategory.CASH]: {
    color: "green",
    label: AssetCategory.CASH,
  },
  [AssetCategory.PROPERTY]: {
    color: "gray",
    label: AssetCategory.PROPERTY,
  },
  [AssetCategory.TAX_DEFERRED]: {
    color: "#F59E0B",
    label: AssetCategory.TAX_DEFERRED,
  },
  [AssetCategory.TAX_FREE]: {
    color: "#8B5CF6",
    label: AssetCategory.TAX_FREE,
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
