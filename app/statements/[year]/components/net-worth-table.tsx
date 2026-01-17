import { StatementHydrated } from "@/lib/db/models/statement";

export default async function NetWorthTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const netWorth = await statement.getNetWorth();
  const totalAssetAmount = await statement.getTotalAssetAmount();
  const totalLiabilityAmount = await statement.getTotalLiabilityAmount();

  const contents = [
    {
      name: "Net worth",
      value: await statement.getNetWorth(),
    },
    {
      name: "Total assets",
      value: await statement.getTotalAssetAmount(),
    },
    {
      name: "Total liabilities",
      value: await statement.getTotalLiabilityAmount(),
    },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {contents.map((row, index) => {
          return (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.value}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
