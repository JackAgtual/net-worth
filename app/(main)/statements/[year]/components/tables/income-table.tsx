import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";

export type IncomeTableData = {
  name: string;
  value: number | undefined;
  format: "dollar" | "percent";
};

export default async function IncomeTable({
  data,
}: {
  data: IncomeTableData[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row, index) => {
          const displayValue =
            row.format === "dollar"
              ? formatAsDollar(row.value)
              : formatAsPercent(row.value);
          return (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{displayValue}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
