import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetCategory } from "@/generated/prisma/enums";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";

export type CategoryTableData = {
  category: AssetCategory;
  amount: number;
  percent: number;
};

export async function CategoryTable({ data }: { data: CategoryTableData[] }) {
  return (
    <Table className="max-w-fit">
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percent of assets</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{formatAsDollar(row.amount)}</TableCell>
              <TableCell>{formatAsPercent(row.percent)}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
