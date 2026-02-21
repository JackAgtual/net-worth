"use client";

import {
  CartesianGrid,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import CustomLine from "@/components/chart/CustomLine";
import { chartConfig } from "@/components/chart/chart-config";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatAsDollar } from "@/lib/utils/format-utils";

type NetWorthChartProps = {
  chartData: {
    year: number;
    netWorth: number;
    totalAssetAmount: number;
    totalLiabilityAmount: number;
  }[];
};

export function NetWorthChart({ chartData }: NetWorthChartProps) {
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
        <CartesianGrid vertical={false} />
        <YAxis tickFormatter={(value) => formatAsDollar(value, true)} />
        <XAxis dataKey="year" tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <ReferenceLine y={0} stroke="black" />
        {CustomLine({ dataKey: "netWorth" })}
        {CustomLine({ dataKey: "totalAssetAmount" })}
        {CustomLine({ dataKey: "totalLiabilityAmount" })}
      </LineChart>
    </ChartContainer>
  );
}
