"use client";

import CustomLine from "@/components/chart/CustomLine";
import { WithdrawalsPercentChartType } from "@/lib/types/chart-data-types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type WithdrawalsChartProps = {
  chartData: WithdrawalsPercentChartType[];
  yAxisFormat?: "dollar" | "percent";
};

export function WithdrawalsChart({
  chartData,
  yAxisFormat = "dollar",
}: WithdrawalsChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData} yAxisFormat={yAxisFormat}>
      {CustomLine({ dataKey: "withdrawals" })}
    </NumberVsYearLineChart>
  );
}
