import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Asset } from "@/generated/prisma/client";
import { getGrowthFromAppreciation } from "@/lib/db/asset";
import { Numberify } from "@/lib/db/numberify";
import { formatAsDollar } from "@/lib/utils/format-utils";
import { EntryDropDown } from "../entry-drop-down";
import { NotesTableCellWrapper } from "./notes-table-cell-wrapper";

export async function AssetTable({
  assets,
  statementId,
}: {
  assets: Numberify<Asset>[];
  statementId: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Retirement</TableHead>
          <TableHead>Include in growth</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Account value 1 year ago</TableHead>
          <TableHead>Self contributions</TableHead>
          <TableHead>Non-self contribution</TableHead>
          <TableHead>Withdrawals</TableHead>
          <TableHead>Growth from appreciation</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => {
          // Need to remove fields that do not exist in form data
          const {
            id,
            statementId: _statementId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...formData
          } = asset;

          return (
            <TableRow key={id}>
              <TableCell>{asset.title}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.retirement ? "Y" : "N"}</TableCell>
              <TableCell>
                {asset.includeInGrowthCalculation ? "Y" : "N"}
              </TableCell>
              <TableCell>{formatAsDollar(asset.amount)}</TableCell>
              <TableCell>{formatAsDollar(asset.amountOneYearAgo)}</TableCell>
              <TableCell>{formatAsDollar(asset.selfContributions)}</TableCell>
              <TableCell>
                {formatAsDollar(asset.nonSelfContributions)}
              </TableCell>
              <TableCell>{formatAsDollar(asset.withdrawals)}</TableCell>
              <TableCell>
                {formatAsDollar(getGrowthFromAppreciation(asset))}
              </TableCell>
              <TableCell>
                <NotesTableCellWrapper>{asset.notes}</NotesTableCellWrapper>
              </TableCell>
              <TableCell className="text-right">
                <EntryDropDown
                  entryId={id}
                  statementId={statementId}
                  entityType="asset"
                  data={formData}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
