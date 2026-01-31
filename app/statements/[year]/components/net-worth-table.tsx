import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { StatementHydrated } from "@/lib/types/statement-types";

export default async function NetWorthTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const contents = [
    {
      name: "Net worth",
      value: await statement.getNetWorth(),
    },
    {
      name: "Total assets",
      value: await statement.getTotalAssetAmount(),
    },
    {
      name: "Total liabilities",
      value: await statement.getTotalLiabilityAmount(),
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
