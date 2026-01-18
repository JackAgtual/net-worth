import { Contributor, StatementHydrated } from "@/lib/db/models/statement";

export default async function ContributionTable({
  statement,
}: {
  statement: StatementHydrated;
}) {
  const allCont = await statement.getContributionAmountByContributor(
    Contributor.All
  );

  const contents = await Promise.all(
    Object.keys(Contributor).map(async (contributor) => {
      const contributorEnum =
        Contributor[contributor as keyof typeof Contributor];

      const amount = await statement.getContributionAmountByContributor(
        contributorEnum
      );
      const percentOfIncome =
        await statement.getContributioPercentOfSalaryByContributor(
          contributorEnum
        );
      return {
        contributor: contributorEnum,
        amount,
        percentOfIncome,
      };
    })
  );
  return (
    <table>
      <thead>
        <tr>
          <th>Contributor</th>
          <th>Amount</th>
          <th>Percent of income</th>
        </tr>
      </thead>
      <tbody>
        {contents.map((row, index) => {
          return (
            <tr key={index}>
              <td>{row.contributor}</td>
              <td>{row.amount}</td>
              <td>{row.percentOfIncome}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
