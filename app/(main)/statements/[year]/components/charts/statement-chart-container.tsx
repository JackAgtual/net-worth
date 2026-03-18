"use client";

import { chartConfig } from "@/components/chart/chart-config";
import { ChartContainer } from "@/components/ui/chart";
import { ReactElement } from "react";

export default function StatementChartContainer({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[500px]"
    >
      {children}
    </ChartContainer>
  );
}
