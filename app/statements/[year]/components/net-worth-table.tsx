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
  const contents = [
    {
      name: "Net worth",
      value: formatAsDollar(await statement.getNetWorth()),
    },
    {
      name: "Total assets",
      value: formatAsDollar(await statement.getTotalAssetAmount()),
    },
    {
      name: "Total liabilities",
      value: formatAsDollar(await statement.getTotalLiabilityAmount()),
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
