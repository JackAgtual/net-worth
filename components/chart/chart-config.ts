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
} satisfies ChartConfig;

export type DataKey = keyof typeof chartConfig;
