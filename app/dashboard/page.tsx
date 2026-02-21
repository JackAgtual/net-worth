import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/lib/actions/auth-actions";
import { checkSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import dbConnect from "@/lib/db/mongodb";
import { formatAsDollar } from "@/lib/utils/format-utils";
import Link from "next/link";
import { NetWorthChart } from "./components/net-worth-chart";

export default async function Home() {
  await dbConnect();
  const session = await checkSession();

  const allStatements = await Statement.find({
    userId: session.user.id,
  }).sort({ year: 1 });

  if (allStatements.length === 0) {
    return (
      <>
        <p>You don't have any statements</p>
        <Link href={"/statements/create"}>Create your first statement</Link>
      </>
    );
  }

  const netWorthPlotData = await Promise.all(
    allStatements.map(async (statement) => {
      const [netWorth, totalAssetAmount, totalLiabilityAmount] =
        await Promise.all([
          statement.getNetWorth(),
          statement.getTotalAssetAmount(),
          statement.getTotalLiabilityAmount(),
        ]);

      return {
        year: statement.year,
        netWorth,
        totalAssetAmount,
        totalLiabilityAmount,
      };
    })
  );

  const mostRecentStatement = allStatements[allStatements.length - 1];

  const [netWorth, assets, liabilities] = await Promise.all([
    mostRecentStatement.getNetWorth(),
    mostRecentStatement.getTotalAssetAmount(),
    mostRecentStatement.getTotalLiabilityAmount(),
  ]);

  return (
    <>
      <div>welcome {session.user.name}</div>
      <Link href={"/statements/create"}>New statement</Link>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
      <p>Most recent statement: {mostRecentStatement?.year}</p>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-fit gap-x-2">
            <p>Net worth:</p>
            <p>{formatAsDollar(netWorth)}</p>
            <p>Assets:</p>
            <p>{formatAsDollar(assets)}</p>
            <p>Liabilities:</p>
            <p>{formatAsDollar(liabilities)}</p>
          </div>
        </CardContent>
      </Card>
      <NetWorthChart chartData={netWorthPlotData} />
      <Card>
        <CardHeader>
          <CardTitle>Asset Growth vs. Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-fit gap-x-2">
            <p>Salary</p>
            <p>{formatAsDollar(netWorth)}</p>
            <p>Asset growth:</p>
            <p>{formatAsDollar(assets)}</p>
            <p>Liabilities:</p>
            <p>{formatAsDollar(liabilities)}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
