import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssetHydrated } from "@/lib/types/asset-types";

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {assets.map((asset) => {
          return (
            <TableRow key={asset._id.toString()}>
              <TableCell>{asset.title}</TableCell>
              <TableCell>{asset.category}</TableCell>
              <TableCell>{asset.retirement ? "Y" : "N"}</TableCell>
              <TableCell>{asset.amount}</TableCell>
              <TableCell>{asset.amountOneYearAgo}</TableCell>
              <TableCell>{asset.contribution?.self}</TableCell>
              <TableCell>{asset.contribution?.nonSelf}</TableCell>
              <TableCell>{asset.getGrowthFromAppreciation()}</TableCell>
              <TableCell>{asset.notes}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
