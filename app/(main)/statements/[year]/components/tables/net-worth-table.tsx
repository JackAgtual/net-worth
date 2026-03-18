import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAsDollar } from "@/lib/utils/format-utils";

type NetWorthTableData = {
  name: string;
  value: number;
  fill?: string;
};

export default async function NetWorthTable({
  data,
}: {
  data: NetWorthTableData[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{formatAsDollar(row.value)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
