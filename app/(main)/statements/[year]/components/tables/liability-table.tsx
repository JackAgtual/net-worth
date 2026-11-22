import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Liability } from "@/generated/prisma/client";
import { LiabilityForm } from "@/lib/types/liability-types";
import { formatAsDollar } from "@/lib/utils/format-utils";
import EntryDropDown from "../entry-drop-down";
import { Numberify } from "@/lib/db/numberify";
import { getGrowthFromInterest } from "@/lib/db/liability";

export default async function LiabilityTable({
  liabilities,
  statementId,
}: {
  liabilities: Numberify<Liability>[];
  statementId: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Liability</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Amount one year ago</TableHead>
          <TableHead>Payments made</TableHead>
          <TableHead>Growth from interest</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {liabilities.map((liability) => {
          const { id } = liability;

          return (
            <TableRow key={id}>
              <TableCell>{liability.title}</TableCell>
              <TableCell>{formatAsDollar(liability.amount)}</TableCell>
              <TableCell>
                {formatAsDollar(liability.amountOneYearAgo)}
              </TableCell>
              <TableCell>{formatAsDollar(liability.paymentsMade)}</TableCell>
              <TableCell>
                {formatAsDollar(getGrowthFromInterest(liability))}
              </TableCell>
              <TableCell>{liability.notes}</TableCell>
              <TableCell className="text-right">
                <EntryDropDown
                  entryId={id}
                  statementId={statementId}
                  entityType="liability"
                  data={liability}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
