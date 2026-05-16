"use client";

import CustomLine from "@/components/chart/CustomLine";
import { WithdrawalsChartType } from "@/lib/types/chart-data-types";
import { NumberVsYearLineChart } from "./number-vs-year-line-chart";

type WithdrawalsChartProps = {
  chartData: WithdrawalsChartType[];
};

export function WithdrawalsChart({ chartData }: WithdrawalsChartProps) {
  return (
    <NumberVsYearLineChart chartData={chartData}>
      {CustomLine({ dataKey: "withdrawals" })}
    </NumberVsYearLineChart>
  );
}
