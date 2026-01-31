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
import EntryDropDown from "./entry-drop-down";

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
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liabilities.map((liability) => {
          const id = liability._id.toString();
          return (
            <TableRow key={id}>
              <TableCell>{liability.title}</TableCell>
              <TableCell>{formatAsDollar(liability.amount)}</TableCell>
              <TableCell>{liability.notes}</TableCell>
              <TableCell className="text-right">
                <EntryDropDown id={id} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
