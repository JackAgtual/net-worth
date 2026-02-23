"use client";

import CustomLine from "@/components/chart/CustomLine";
import { ContributionPercentChartData } from "@/lib/types/chart-data-types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type ContributionPercentChartProps = {
  chartData: ContributionPercentChartData[];
};

export function ContributionPercentChart({
  chartData,
}: ContributionPercentChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData} yAxisFormat="percent">
      {CustomLine({ dataKey: "totalContributionPct" })}
      {CustomLine({ dataKey: "selfContributionPct" })}
      {CustomLine({ dataKey: "nonSelfContributionPct" })}
    </NumberVsYearLineChart>
  );
}
