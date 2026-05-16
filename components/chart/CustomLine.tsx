import type { ComponentProps } from "react";
import { Line } from "recharts";
import { chartConfig, DataKey } from "./chart-config";

type CustomLineProps = Omit<ComponentProps<typeof Line>, "dataKey" | "ref"> & {
  dataKey: DataKey;
  dashed?: boolean;
};

export default function CustomLine({
  dataKey,
  strokeWidth = 2.5,
  dot = false,
  connectNulls = true,
  dashed = false,
  ...remainingProps
}: CustomLineProps) {
  return (
    <Line
      dataKey={dataKey}
      stroke={chartConfig[dataKey].color}
      strokeWidth={strokeWidth}
      dot={dot}
      connectNulls={connectNulls}
      strokeDasharray={dashed ? "5 5" : ""}
      {...remainingProps}
    />
  );
}
