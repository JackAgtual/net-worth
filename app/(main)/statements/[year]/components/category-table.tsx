import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
import { Category } from "@/types/types";

type CategoryTableData = {
  category: Category;
  amount: number;
  percent: number;
  fill?: string;
};

export default async function CategoryTable({
  data,
}: {
  data: CategoryTableData[];
}) {
  return (
    <>
      <Table>
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
    </>
  );
}
