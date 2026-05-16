"use client";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Fill } from "@/lib/types/chart-data-types";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ContributionWithdrawalTableData } from "../tables/contribution-withdrawal-table";
import StatementChartContainer from "./statement-chart-container";

type ContributionWithdrawalChartData = ContributionWithdrawalTableData & Fill;

export default function ContributionWithdrawalChart({
  data,
}: {
  data: ContributionWithdrawalChartData[];
}) {
  function getPctOfIncome(val: number) {
    return `${formatAsPercent(val)} of salary`;
  }
  return (
    <StatementChartContainer>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        {/* TODO: Fix bar labels overlapping */}
        <XAxis
          dataKey="metric"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          interval={0}
        />
        <YAxis
          yAxisId="amount"
          tickFormatter={(value) => formatAsDollar(value, true)}
        />
        <ReferenceLine y={0} stroke="black" yAxisId="amount" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item) => (
                <div className="flex flex-col">
                  <span className="font-bold">{item.payload.metric}</span>
                  <span>{formatAsDollar(item.payload.amount)}</span>
                  <span>{getPctOfIncome(item.payload.percentOfIncome)}</span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="amount" radius={8} yAxisId="amount">
          <LabelList
            dataKey="percentOfIncome"
            position="top"
            formatter={getPctOfIncome}
            className="fill-primary text-xs"
          />
        </Bar>
      </BarChart>
    </StatementChartContainer>
  );
}
