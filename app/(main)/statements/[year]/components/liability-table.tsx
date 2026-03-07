import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiabilityForm, LiabilityHydrated } from "@/lib/types/liability-types";
import { formatAsDollar } from "@/lib/utils/format-utils";
import EntryDropDown from "./entry-drop-down";

export default async function LiabilityTable({
  liabilities,
  statementId,
}: {
  liabilities: LiabilityHydrated[];
  statementId: string;
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

          // TODO: Find a better way to do this
          const liabilityFormData: LiabilityForm = {
            title: liability.title,
            amount: liability.amount,
            notes: liability.notes,
          };

          return (
            <TableRow key={id}>
              <TableCell>{liability.title}</TableCell>
              <TableCell>{formatAsDollar(liability.amount)}</TableCell>
              <TableCell>{liability.notes}</TableCell>
              <TableCell className="text-right">
                <EntryDropDown
                  entryId={id}
                  statementId={statementId}
                  entityType="liability"
                  data={liabilityFormData}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
