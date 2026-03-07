import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
import { CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

type CommonChartSetupProps = {
  yAxisFormat: "dollar" | "percent";
  xAxisReferenceLine?: boolean;
};

export function CommonChartSetup({
  yAxisFormat,
  xAxisReferenceLine = false,
}: CommonChartSetupProps) {
  // Need to return array because recharts won't accept fragment
  return [
    <CartesianGrid vertical={false} key="CartesianGrid" />,
    <YAxis
      key="YAxis"
      tickFormatter={(value) =>
        yAxisFormat === "dollar"
          ? formatAsDollar(value, true)
          : formatAsPercent(value)
      }
    />,
    <XAxis key="XAxis" dataKey="year" tickMargin={8} />,
    <ChartTooltip
      key="ChartTooltip"
      cursor={false}
      content={<ChartTooltipContent />}
    />,
    <ChartLegend key="ChartLegend" content={<ChartLegendContent />} />,
    xAxisReferenceLine && (
      <ReferenceLine key="ReferenceLine" y={0} stroke="black" />
    ),
  ];
}
