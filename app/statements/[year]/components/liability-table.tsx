import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiabilityHydrated } from "@/lib/types/liability-types";
import { formatAsDollar } from "@/lib/utils/format-utils";

export default async function LiabilityTable({
  liabilities,
}: {
  liabilities: LiabilityHydrated[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Liability</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liabilities.map((liability) => {
          return (
            <TableRow key={liability._id.toString()}>
              <TableCell>{liability.title}</TableCell>
              <TableCell>{formatAsDollar(liability.amount)}</TableCell>
              <TableCell>{liability.notes}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
