import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatementHydrated } from "@/lib/types/statement-types";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";
import { Category } from "@/types/types";

export default async function CategoryTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const contents = await Promise.all(
    Object.keys(Category).map(async (category) => {
      const categoryEnum = Category[category as keyof typeof Category];
      const amount = formatAsDollar(
        await statement.getTotalAssetAmountByCategory(categoryEnum)
      );
      const percent = formatAsPercent(
        await statement.getPercentOfAssetsByCategory(categoryEnum)
      );
      return {
        category,
        amount,
        percent,
      };
    })
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percent of assets</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {contents.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.percent}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
