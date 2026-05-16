import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";

export type ContributionWithdrawalTableData = {
  metric: string;
  amount: number;
  percentOfIncome: number | undefined;
};

export default async function ContributionWithdrawalTable({
  data,
}: {
  data: ContributionWithdrawalTableData[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percent of income</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.metric}</TableCell>
              <TableCell>{formatAsDollar(row.amount)}</TableCell>
              <TableCell>{formatAsPercent(row.percentOfIncome)}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
