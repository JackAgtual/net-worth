import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatementHydrated } from "@/lib/types/statement-types";
import { Contributor } from "@/lib/types/types";

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contributor</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Percent of income</TableHead>
        </TableRow>
      </TableHeader>
      <tbody>
        {contents.map((row, index) => {
          return (
            <TableRow key={index}>
              <TableCell>{row.contributor}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.percentOfIncome}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
