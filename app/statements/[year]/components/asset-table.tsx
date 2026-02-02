import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetForm, AssetHydrated } from "@/lib/types/asset-types";
import { formatAsDollar } from "@/lib/utils/format-utils";
import EntryDropDown from "./entry-drop-down";

export default async function AssetTable({
  assets,
}: {
  assets: AssetHydrated[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Retirement</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Account value 1 year ago</TableHead>
          <TableHead>Self contributions</TableHead>
          <TableHead>Non-self contribution</TableHead>
          <TableHead>Growth from appreciation</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => {
          const id = asset._id.toString();

          // TODO: Find a better way to do this
          const assetFormData: AssetForm = {
            title: asset.title,
            amount: asset.amount,
            category: asset.category,
            retirement: asset.retirement,
            amountOneYearAgo: asset.amountOneYearAgo,
            contribution: {
              self: asset.contribution?.self,
              nonSelf: asset.contribution?.nonSelf,
            },
            includeInGrowthCalculation: asset.includeInGrowthCalculation,
            notes: asset.notes,
          };

          return (
            <TableRow key={id}>
              <TableCell>{asset.title}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.retirement ? "Y" : "N"}</TableCell>
              <TableCell>{formatAsDollar(asset.amount)}</TableCell>
              <TableCell>{formatAsDollar(asset.amountOneYearAgo)}</TableCell>
              <TableCell>{formatAsDollar(asset.contribution?.self)}</TableCell>
              <TableCell>
                {formatAsDollar(asset.contribution?.nonSelf)}
              </TableCell>
              <TableCell>
                {formatAsDollar(asset.getGrowthFromAppreciation())}
              </TableCell>
              <TableCell>{asset.notes}</TableCell>
              <TableCell className="text-right">
                <EntryDropDown
                  id={id}
                  entityType="asset"
                  data={assetFormData}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
