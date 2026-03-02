"use client";

import {
  CartesianGrid,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import { chartConfig } from "@/components/chart/chart-config";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
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
        {CommonChartSetup({ yAxisFormat })}
        {children}
      </LineChart>
    </ChartContainer>
  );
}
