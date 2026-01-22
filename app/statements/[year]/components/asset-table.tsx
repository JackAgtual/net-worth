import { AssetHydrated, StatementHydrated } from "@/lib/db/models";

export default async function AssetTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const assets = await statement.getAssets();

  return (
    <table>
      <thead>
        <tr>
          <th>Asset</th>
          <th>Category</th>
          <th>Retirement</th>
          <th>Amount</th>
          <th>Account value 1 year ago</th>
          <th>Self contributions</th>
          <th>Non-self contribution</th>
          <th>Growth from appreciation</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => {
          return (
            <tr key={asset._id.toString()}>
              <td>{asset.title}</td>
              <td>{asset.category}</td>
              <td>{asset.retirement ? "Y" : "N"}</td>
              <td>{asset.amount}</td>
              <td>{asset.amountOneYearAgo}</td>
              <td>{asset.contribution?.self}</td>
              <td>{asset.contribution?.nonSelf}</td>
              <td>{asset.getGrowthFromAppreciation()}</td>
              <td>{asset.notes}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
