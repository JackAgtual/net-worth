import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contributor } from "@/lib/types/types";
import { formatAsDollar, formatAsPercent } from "@/lib/utils/format-utils";

export type ContributionTableData = {
  contributor: Contributor;
  amount: number;
  percentOfIncome: number | undefined;
};

export default async function ContributionTable({
  data,
}: {
  data: ContributionTableData[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contributor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percent of income</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {data.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.contributor}</TableCell>
              <TableCell>{formatAsDollar(row.amount)}</TableCell>
              <TableCell>{formatAsPercent(row.percentOfIncome)}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
