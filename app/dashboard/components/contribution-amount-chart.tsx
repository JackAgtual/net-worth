"use client";

import CustomLine from "@/components/chart/CustomLine";
import { ContributionAmountChartData } from "@/lib/types/chart-data-types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type ContributionAmountChartProps = {
  chartData: ContributionAmountChartData[];
};

export function ContributionAmountChart({
  chartData,
}: ContributionAmountChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData}>
      {CustomLine({ dataKey: "totalContributionAmount" })}
      {CustomLine({ dataKey: "selfContributionAmount" })}
      {CustomLine({ dataKey: "nonSelfContributionAmount" })}
    </NumberVsYearLineChart>
  );
}
