"use client";

import CustomLine from "@/components/chart/CustomLine";
import { ContributionPercentChartData } from "@/lib/types/chart-data-types";
import { Contributor } from "@/lib/types/types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type ContributionChartProps = {
  chartData: ContributionPercentChartData[];
  yAxisFormat?: "dollar" | "percent";
};

export function ContributionChart({
  chartData,
  yAxisFormat = "dollar",
}: ContributionChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData} yAxisFormat={yAxisFormat}>
      {Object.values(Contributor).map((contributor) => {
        return CustomLine({ dataKey: contributor });
      })}
    </NumberVsYearLineChart>
  );
}
