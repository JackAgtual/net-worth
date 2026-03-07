"use client";

import { LineChart } from "recharts";

import { chartConfig } from "@/components/chart/chart-config";
import { ChartContainer } from "@/components/ui/chart";
import { CommonChartSetup } from "./common-chart-setup";

type DollarVsYearLineChartProps<T> = {
  chartData: T[];
  yAxisFormat?: "dollar" | "percent";
  children: React.ReactNode;
};

export function NumberVsYearLineChart<T>({
  chartData,
  yAxisFormat = "dollar",
  children,
}: DollarVsYearLineChartProps<T>) {
  return (
    <ChartContainer config={chartConfig} className="min-h-40 text-base">
      <LineChart
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        {CommonChartSetup({ yAxisFormat, xAxisReferenceLine: true })}
        {children}
      </LineChart>
    </ChartContainer>
  );
}
