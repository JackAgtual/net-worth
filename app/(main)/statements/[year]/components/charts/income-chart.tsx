"use client";

import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Fill, IncomeData } from "@/lib/types/chart-data-types";
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
import { IncomeTableData } from "../tables/income-table";
import StatementChartContainer from "./statement-chart-container";

export type IncomeChartData = IncomeTableData & Fill & { hideBar?: boolean };

export default function IncomeChart({ data }: { data: IncomeChartData[] }) {
  const filteredData = data.filter((el) => el.hideBar !== true);
  const percentOfSalary = data.find(
    (el) => el.name === IncomeData.AssetGrowthPercentOfSalary
  )?.value;
  const percentOfSalaryDisplayText = `${formatAsPercent(percentOfSalary)} of salary`;

  const shouldDisplayPctAssetGrowth = (field: string) =>
    field === IncomeData.LastYearAssetGrowth;

  return (
    <StatementChartContainer>
      <BarChart accessibilityLayer data={filteredData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          yAxisId="value"
          tickFormatter={(value) => formatAsDollar(value, true)}
        />
        <ReferenceLine y={0} stroke="black" yAxisId="value" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              hideLabel
              formatter={(value, name, item) => {
                return (
                  <div className="flex flex-col">
                    <span className="font-bold">{item.payload.name}</span>
                    <span>{formatAsDollar(item.payload.value)}</span>
                    {shouldDisplayPctAssetGrowth(item.payload.name) && (
                      <span>{percentOfSalaryDisplayText}</span>
                    )}
                  </div>
                );
              }}
            />
          }
        />
        <Bar dataKey="value" radius={8} yAxisId="value">
          <LabelList
            dataKey="value"
            position="top"
            content={(props) => {
              const { x, y, width, value, index } = props;
              const entry = filteredData[index as number];

              if (!shouldDisplayPctAssetGrowth(entry?.name)) return null;

              return (
                <text
                  x={Number(x) + Number(width) / 2}
                  y={Number(y) - 8}
                  textAnchor="middle"
                  className="fill-primary text-xs"
                >
                  {percentOfSalaryDisplayText}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </StatementChartContainer>
  );
}
