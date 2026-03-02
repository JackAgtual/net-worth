"use client";

import { chartConfig } from "@/components/chart/chart-config";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CategoryChartData } from "@/lib/types/chart-data-types";
import { Category } from "@/lib/types/types";
import { formatAsPercent } from "@/lib/utils/format-utils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { CommonChartSetup } from "./common-chart-setup";

type ContributionChartProps = {
  chartData: CategoryChartData[];
};

export function CategoryPercentageChart({ chartData }: ContributionChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-40 text-base">
      <AreaChart
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        {CommonChartSetup({
          yAxisFormat: "percent",
          xAxisReferenceLine: false,
        })}
        {Object.values(Category).map((category) => {
          return (
            <Area
              dataKey={category}
              stackId="a"
              fill={chartConfig[category].color}
              stroke={chartConfig[category].color}
            />
          );
        })}
      </AreaChart>
    </ChartContainer>
  );
}
