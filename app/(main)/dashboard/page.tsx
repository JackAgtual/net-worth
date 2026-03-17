import NoStatements from "@/components/misc/no-statements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllStatements } from "@/lib/dal/statement-dal";
import { formatAsDollar } from "@/lib/utils/format-utils";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import { AssetGrowthChart } from "./components/asset-growth-chart";
import { CategoryPercentageChart } from "./components/category-percentage-chart";
import ChartCard from "./components/chart-card";
import { ContributionChart } from "./components/contribution-chart";
import { NetWorthChart } from "./components/net-worth-chart";

export default async function Home() {
  const allStatements = await getAllStatements();

  if (allStatements.length === 0) {
    return <NoStatements />;
  }

  const statementDataAggregator = new StatementDataAggregator(allStatements);
  const [plotData, mostRecent] = await Promise.all([
    statementDataAggregator.getPlotData(),
    statementDataAggregator.getMostRecentStatementData(),
  ]);

  return (
    <>
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
