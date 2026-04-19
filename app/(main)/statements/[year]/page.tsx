import { chartConfig } from "@/components/chart/chart-config";
import { getStatementFromYear } from "@/lib/dal/statement-dal";
import { IncomeData } from "@/lib/types/chart-data-types";
import { Category, Contributor } from "@/lib/types/types";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import { SearchParams } from "next/dist/server/request/search-params";
import AddEntry from "./components/add-entry";
import CategoryChart from "./components/charts/category-chart";
import ContributionChart from "./components/charts/contribution-chart";
import IncomeChart, { IncomeChartData } from "./components/charts/income-chart";
import NetWorthChart from "./components/charts/net-worth-chart";
import AssetTable from "./components/tables/asset-table";
import CategoryTable from "./components/tables/category-table";
import ContributionTable from "./components/tables/contribution-table";
import IncomeTable from "./components/tables/income-table";
import LiabilityTable from "./components/tables/liability-table";
import NetWorthTable from "./components/tables/net-worth-table";
import ViewSelector from "./components/view-selector";

type PageProps = {
  params: Promise<{
    year: number;
  }>;
  searchParams: Promise<SearchParams>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { year } = await params;

  const { view = "table" } = await searchParams;

  const statement = await getStatementFromYear(year);

  if (!statement) return <div>Couldn't find that statement</div>;

  const [assets, liabilities, data] = await Promise.all([
    statement.getAssets(),
    statement.getLiabilities(),
    StatementDataAggregator.getAllDataFromStatement(statement),
  ]);

  const netWorthData = [
    {
      name: "Net Worth",
      value: data.netWorth,
      fill: chartConfig.netWorth.color,
    },
    {
      name: "Total Asset Amount",
      value: data.assetAmount,
      fill: chartConfig.totalAssetAmount.color,
    },
    {
      name: "Total Liability Amount",
      value: data.liabilityAmount,
      fill: chartConfig.totalLiabilityAmount.color,
    },
  ];

  const categoryData = Object.values(Category).map((category) => {
    return {
      category,
      amount: data.categories.amount[category],
      percent: data.categories.percent[category],
      fill: chartConfig[category].color,
    };
  });

  const contributionData = Object.values(Contributor).map((contributor) => {
    return {
      contributor,
      amount: data.contributions.amount[contributor],
      percentOfIncome: data.contributions.percentOfSalary[contributor],
      fill: chartConfig[contributor].color,
    };
  });

  const incomeData: IncomeChartData[] = [
    {
      name: IncomeData.LastYearIncome,
      value: statement.lastYearSalary,
      format: "dollar",
      fill: chartConfig.lastYearSalary.color,
    },
    {
      name: IncomeData.LastYearAssetGrowth,
      value: data.lastYearAssetGrowth,
      format: "dollar",
      fill: chartConfig.lastYearAssetGrowth.color,
    },
    {
      name: IncomeData.AssetGrowthPercentOfSalary,
      value: data.lastYearAssetGrowthPercentOfSalary,
      format: "percent",
      fill: "",
      hideBar: true,
    },
  ];

  const statementId = statement._id.toString();

  return (
    <>
      <h1>{year} statement</h1>
      <h2>Assets</h2>
      <AssetTable assets={assets} statementId={statementId} />
      <AddEntry entryType="asset" statementId={statementId} />
      <h2>Liabilities</h2>
      <LiabilityTable liabilities={liabilities} statementId={statementId} />
      <AddEntry entryType="liability" statementId={statementId} />
      <ViewSelector />
      <h2>Net worth</h2>
      {view === "table" ? (
        <NetWorthTable data={netWorthData} />
      ) : (
        <NetWorthChart data={netWorthData} />
      )}

      <h2>Category analysis</h2>
      {view === "table" ? (
        <CategoryTable data={categoryData} />
      ) : (
        <CategoryChart data={categoryData} />
      )}

      <h2>Income analysis</h2>
      {view === "table" ? (
        <IncomeTable data={incomeData} />
      ) : (
        <IncomeChart data={incomeData} />
      )}
      <h2>Contribution analysis</h2>
      {view === "table" ? (
        <ContributionTable data={contributionData} />
      ) : (
        <ContributionChart data={contributionData} />
      )}
    </>
  );
}
