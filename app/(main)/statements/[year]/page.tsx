import { chartConfig } from "@/components/chart/chart-config";
import { getStatementFromYear } from "@/lib/dal/statement-dal";
import { Category, Contributor } from "@/lib/types/types";
import { SearchParams } from "next/dist/server/request/search-params";
import AddEntry from "./components/add-entry";
import CategoryChart from "./components/charts/category-chart";
import ContributionChart from "./components/charts/contribution-chart";
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

  const [assets, liabilities] = await Promise.all([
    statement.getAssets(),
    statement.getLiabilities(),
  ]);

  const [netWorth, totalAssetAmount, totalLiabilityAmount] = await Promise.all([
    statement.getNetWorth(),
    statement.getTotalAssetAmount(),
    statement.getTotalLiabilityAmount(),
  ]);
  const netWorthData = [
    { name: "Net Worth", value: netWorth, fill: chartConfig.netWorth.color },
    {
      name: "Total Asset Amount",
      value: totalAssetAmount,
      fill: chartConfig.totalAssetAmount.color,
    },
    {
      name: "Total Liability Amount",
      value: totalLiabilityAmount,
      fill: chartConfig.totalLiabilityAmount.color,
    },
  ];

  const categoryData = await Promise.all(
    Object.values(Category).map(async (category) => {
      const amount = await statement.getTotalAssetAmountByCategory(category);
      const percent = await statement.getPercentOfAssetsByCategory(category);
      return {
        category,
        amount,
        percent,
        fill: chartConfig[category].color,
      };
    })
  );

  const contributionData = await Promise.all(
    Object.values(Contributor).map(async (contributor) => {
      const amount =
        await statement.getContributionAmountByContributor(contributor);

      const percentOfIncome =
        await statement.getContributioPercentOfSalaryByContributor(contributor);

      const fill = chartConfig[contributor].color;
      return {
        contributor,
        amount,
        percentOfIncome,
        fill,
      };
    })
  );

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
      <IncomeTable statement={statement} />
      <h2>Contribution analysis</h2>
      {view === "table" ? (
        <ContributionTable data={contributionData} />
      ) : (
        <ContributionChart data={contributionData} />
      )}
    </>
  );
}
