import { NoStatements } from "@/components/misc/no-statements";
import { Button } from "@/components/ui/button";
import { getAllStatements } from "@/lib/dal/statement-dal";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import Link from "next/link";
import { StatementsTable } from "./components/statements-table";

export default async function Page() {
  const allStatements = await getAllStatements(false);

  if (allStatements.length === 0) {
    return <NoStatements />;
  }

  const statementDataAggregator = new StatementDataAggregator(allStatements);
  const statementOverview = statementDataAggregator.getStatementOverviewData();

  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1>Your statements</h1>
        <p>Click on a row to see more details</p>
      </div>
      <Link href="/statements/create">
        <Button>Create new statement</Button>
      </Link>
      <StatementsTable data={statementOverview} />
    </div>
  );
}
