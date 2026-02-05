import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatementHydrated } from "@/lib/types/statement-types";
import { formatAsDollar } from "@/lib/utils/format-utils";

export default async function NetWorthTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const [netWorth, totalAssetAmount, totalLiabilityAmount] = await Promise.all([
    statement.getNetWorth(),
    statement.getTotalAssetAmount(),
    statement.getTotalLiabilityAmount(),
  ]);

  const contents = [
    {
      name: "Net worth",
      value: formatAsDollar(netWorth),
    },
    {
      name: "Total assets",
      value: formatAsDollar(totalAssetAmount),
    },
    {
      name: "Total liabilities",
      value: formatAsDollar(totalLiabilityAmount),
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contents.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
