import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "@/lib/actions/auth-actions";
import { checkSession } from "@/lib/auth/auth-utils";
import { Statement } from "@/lib/db/models";
import dbConnect from "@/lib/db/mongodb";
import { formatAsDollar } from "@/lib/utils/format-utils";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import Link from "next/link";
import { AssetGrowthChart } from "./components/asset-growth-chart";
import { CategoryPercentageChart } from "./components/category-percentage-chart";
import ChartCard from "./components/chart-card";
import { ContributionChart } from "./components/contribution-chart";
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

  const statementDataAggregator = new StatementDataAggregator(allStatements);
  const plotData = await statementDataAggregator.getPlotData();
  const mostRecent = await statementDataAggregator.getMostRecentStatementData();

  return (
    <>
      <div>welcome {session.user.name}</div>
      <Link href={"/statements/create"}>New statement</Link>
      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
      <p>Most recent statement: {mostRecent?.year}</p>

      <Card>
        <CardHeader>
          <CardTitle>Net Worth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-fit gap-x-2">
            <p>Net worth:</p>
            <p>{formatAsDollar(mostRecent.netWorth)}</p>
            <p>Assets:</p>
            <p>{formatAsDollar(mostRecent.assets)}</p>
            <p>Liabilities:</p>
            <p>{formatAsDollar(mostRecent.liabilities)}</p>
          </div>
        </CardContent>
      </Card>
      <ChartCard title="Net Worth vs. Time">
        <NetWorthChart chartData={plotData.netWorth} />
      </ChartCard>
      <ChartCard title="Asset Category vs. Time">
        <CategoryPercentageChart chartData={plotData.categoryPercentage} />
      </ChartCard>
      <Card>
        <CardHeader>
          <CardTitle>Asset Growth vs. Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 w-fit gap-x-2">
            <p>Salary</p>
            <p>{formatAsDollar(mostRecent.lastYearSalary)}</p>
            <p>Asset growth:</p>
            <p>{formatAsDollar(mostRecent.lastYearAssetGrowth)}</p>
          </div>
        </CardContent>
      </Card>
      <ChartCard title="Asset Growth & Salary vs. Time">
        <AssetGrowthChart chartData={plotData.assetGrowth} />
      </ChartCard>
      <ChartCard title="Contribution Amount vs. Time">
        <ContributionChart chartData={plotData.contributionAmount} />
      </ChartCard>
      <ChartCard title="Contribution Percent of Salary vs. Time">
        <ContributionChart
          chartData={plotData.contributionPercentOfSalary}
          yAxisFormat="percent"
        />
      </ChartCard>
      <ChartCard title="Cumulative Contribution Amount vs. Time">
        <ContributionChart chartData={plotData.cumulativeContributionAmount} />
      </ChartCard>
    </>
  );
}
