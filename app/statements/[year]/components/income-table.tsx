import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatementHydrated } from "@/lib/types/statement-types";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";

export default async function IncomeTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const [lastYearAssetGrowth, lastYearAssetGrowthPercentOfSalary] =
    await Promise.all([
      statement.getLastYearAssetGrowth(),
      statement.getLastYearAssetGrowthPercentOfSalary(),
    ]);
  const contents = [
    {
      name: "Last year income",
      value: formatAsDollar(statement.lastYearSalary),
    },
    {
      name: "Last year asset growth",
      value: formatAsDollar(lastYearAssetGrowth),
    },
    {
      name: "Last year asset growth percent of salary",
      value: formatAsPercent(lastYearAssetGrowthPercentOfSalary),
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {contents.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
