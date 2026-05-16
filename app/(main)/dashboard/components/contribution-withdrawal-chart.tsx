"use client";

import CustomLine from "@/components/chart/CustomLine";
import { ContributionAndWithdrawalPercentChartData } from "@/lib/types/chart-data-types";
import { Contributor } from "@/lib/types/types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type ContributionChartProps = {
  chartData: ContributionAndWithdrawalPercentChartData[];
  yAxisFormat?: "dollar" | "percent";
};

export function ContributionWithdrawalChart({
  chartData,
  yAxisFormat = "dollar",
}: ContributionChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData} yAxisFormat={yAxisFormat}>
      {Object.values(Contributor).map((contributor) => {
        return CustomLine({ dataKey: contributor });
      })}
      {CustomLine({ dataKey: "withdrawals" })}
      {CustomLine({ dataKey: "netContributions", dashed: true })}
    </NumberVsYearLineChart>
  );
}
