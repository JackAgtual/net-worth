import type { ComponentProps } from "react";
import { Line } from "recharts";
import { chartConfig, DataKey } from "./chart-config";

type CustomLineProps = Omit<ComponentProps<typeof Line>, "dataKey" | "ref"> & {
  dataKey: DataKey;
};

export default function CustomLine({
  dataKey,
  strokeWidth = 2.5,
  dot = false,
  connectNulls = true,
  ...remainingProps
}: CustomLineProps) {
  return (
    <Line
      dataKey={dataKey}
      stroke={chartConfig[dataKey].color}
      strokeWidth={strokeWidth}
      dot={dot}
      connectNulls={connectNulls}
      {...remainingProps}
    />
  );
}
