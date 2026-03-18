"use client";

import { chartConfig } from "@/components/chart/chart-config";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
import { Pie, PieChart } from "recharts";

type CategoryChartData = {
  category: string;
  amount: number;
  percent: number;
  fill: string;
};

export default function CategoryChart({ data }: { data: CategoryChartData[] }) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[500px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item) => (
                <div className="flex flex-col">
                  <span className="font-bold">{item.payload.category}</span>
                  <span>{formatAsDollar(item.payload.amount)}</span>
                  <span>{formatAsPercent(item.payload.percent)} of assets</span>
                </div>
              )}
            />
          }
        />
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          innerRadius="60%"
          outerRadius="100%"
        />
        <ChartLegend
          content={<ChartLegendContent nameKey="category" />}
          className="text-base flex-wrap gap-2 *:basis-1/4 *:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
