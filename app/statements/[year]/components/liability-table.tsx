import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiabilityHydrated } from "@/lib/types/liability-types";

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
              <TableCell>{liability.amount}</TableCell>
              <TableCell>{liability.notes}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
