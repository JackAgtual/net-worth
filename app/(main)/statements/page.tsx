import NoStatements from "@/components/misc/no-statements";
import { getAllStatements } from "@/lib/dal/statement-dal";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import Link from "next/link";
import StatementsTable from "./components/statements-table";

export default async function Page() {
  const allStatements = await getAllStatements(false);

  if (allStatements.length === 0) {
    return <NoStatements />;
  }

  const statementDataAggregator = new StatementDataAggregator(allStatements);
  const statementOverview =
    await statementDataAggregator.getStatementOverviewData();

  return (
    <>
      <h1>statements</h1>
      <Link href="/statements/create">Create new statement</Link>
      <StatementsTable data={statementOverview} />
    </>
  );
}
