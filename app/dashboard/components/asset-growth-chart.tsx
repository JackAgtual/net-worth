"use client";

import CustomLine from "@/components/chart/CustomLine";
import { AssetGrowthChartData } from "@/lib/types/chart-data-types";
import { DollarVsYearLineChart } from "./dollar-vs-year-line-chart";

type AssetGrowthChartProps = {
  chartData: AssetGrowthChartData[];
};

export function AssetGrowthChart({ chartData }: AssetGrowthChartProps) {
  return (
    <DollarVsYearLineChart chartData={chartData}>
      {CustomLine({ dataKey: "lastYearAssetGrowth" })}
      {CustomLine({ dataKey: "lastYearSalary" })}
    </DollarVsYearLineChart>
  );
}
