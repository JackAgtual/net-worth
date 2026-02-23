"use client";

import CustomLine from "@/components/chart/CustomLine";
import { AssetGrowthChartData } from "@/lib/types/chart-data-types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type AssetGrowthChartProps = {
  chartData: AssetGrowthChartData[];
};

export function AssetGrowthChart({ chartData }: AssetGrowthChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData}>
      {CustomLine({ dataKey: "lastYearAssetGrowth" })}
      {CustomLine({ dataKey: "lastYearSalary" })}
    </NumberVsYearLineChart>
  );
}
