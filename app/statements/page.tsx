import { getSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import Link from "next/link";
import { redirect } from "next/navigation";
import StatementsTable from "./components/statements-table";

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const allStatements = await Statement.find({
    userId: session.user.id,
  }).sort({ year: -1 });

  if (allStatements.length === 0) {
    return (
      <>
        <p>You don't have any statements</p>
        <Link href={"/statements/create"}>Create your first statement</Link>
      </>
    );
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
