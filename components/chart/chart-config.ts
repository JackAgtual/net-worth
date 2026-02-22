import { ChartConfig } from "../ui/chart";

export const chartConfig = {
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
  lastYearSalary: {
    label: "Last year salary",
    color: "gray",
  },
  lastYearAssetGrowth: {
    label: "Last year asset growth",
    color: "green",
  },
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
