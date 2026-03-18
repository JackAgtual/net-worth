"use client";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatAsDollar } from "@/lib/utils/format-utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import StatementChartContainer from "./statement-chart-container";
import { NetWorthTableData } from "../tables/net-worth-table";
import { Fill } from "@/lib/types/chart-data-types";

type NetWorthChartData = NetWorthTableData & Fill;

export default function NetWorthChart({ data }: { data: NetWorthChartData[] }) {
  return (
    <StatementChartContainer>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          dataKey="value"
          tickFormatter={(value) => formatAsDollar(value, true)}
        />
        <ReferenceLine y={0} stroke="black" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item) => (
                <div className="flex flex-col">
                  <span className="font-bold">{item.payload.name}</span>
                  <span>{formatAsDollar(item.payload.value)}</span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="value" radius={8} />
      </BarChart>
    </StatementChartContainer>
  );
}
