import { LiabilityHydrated, StatementHydrated } from "@/lib/db/models";

export default async function LiabilityTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const liabilities = await statement.getLiabilities();

  return (
    <table>
      <thead>
        <tr>
          <th>Liability</th>
          <th>Amount</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {liabilities.map((liability) => {
          return (
            <tr key={liability._id.toString()}>
              <td>{liability.title}</td>
              <td>{liability.amount}</td>
              <td>{liability.notes}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
