"use client";

import CustomLine from "@/components/chart/CustomLine";
import { NetWorthChartData } from "@/lib/types/chart-data-types";
import { DollarVsYearLineChart } from "./dollar-vs-year-line-chart";

type NetWorthChartProps = {
  chartData: NetWorthChartData[];
};

export function NetWorthChart({ chartData }: NetWorthChartProps) {
  return (
    <DollarVsYearLineChart chartData={chartData}>
      {CustomLine({ dataKey: "netWorth" })}
      {CustomLine({ dataKey: "totalAssetAmount" })}
      {CustomLine({ dataKey: "totalLiabilityAmount" })}
    </DollarVsYearLineChart>
  );
}
