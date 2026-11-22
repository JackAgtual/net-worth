import { chartConfig } from "@/components/chart/chart-config";
import { AssetCategory } from "@/generated/prisma/enums";
import { getStatementFromYear } from "@/lib/dal/statement-dal";
import { IncomeData } from "@/lib/types/chart-data-types";
import { Contributor } from "@/lib/types/types";
import { StatementDataAggregator } from "@/lib/utils/statement-data-aggregator";
import { SearchParams } from "next/dist/server/request/search-params";
import { AddEntry } from "./components/add-entry";
import { CategoryChart } from "./components/charts/category-chart";
import { AmountAndPercentOfIncomeChart } from "./components/charts/contribution-withdrawal-chart";
import { IncomeChart, IncomeChartData } from "./components/charts/income-chart";
import { NetWorthChart } from "./components/charts/net-worth-chart";
import { AssetTable } from "./components/tables/asset-table";
import { CategoryTable } from "./components/tables/category-table";
import { AmountAndPercentOfIncomeTable } from "./components/tables/contribution-withdrawal-table";
import { IncomeTable } from "./components/tables/income-table";
import { LiabilityTable } from "./components/tables/liability-table";
import { NetWorthTable } from "./components/tables/net-worth-table";
import { ViewSelector } from "./components/view-selector";
import { tiktok } from "better-auth";
import { ReactNode } from "react";

type PageProps = {
  params: Promise<{
    year: string;
  }>;
  searchParams: Promise<SearchParams>;
};

type TableChartMetric = {
  title: string;
  table: ReactNode;
  chart: ReactNode;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);

  const { view = "table" } = await searchParams;

  const statement = await getStatementFromYear(year);

  if (!statement) return <div>Couldn't find that statement</div>;

  const data = StatementDataAggregator.getAllDataFromStatement(statement);

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

  const categoryData = Object.values(AssetCategory).map((category) => {
    return {
      category,
      amount: data.categories.amount[category],
      percent: data.categories.percent[category],
      fill: chartConfig[category].color,
    };
  });

  const contributionData = [
    ...Object.values(Contributor).map((contributor) => {
      return {
        metric: `${contributor} contributions`,
        amount: data.contributions.amount[contributor],
        percentOfIncome: data.contributions.percentOfSalary[contributor],
        fill: chartConfig[contributor].color,
      };
    }),
    {
      metric: "Withdrawals",
      amount: data.withdrawals.amount,
      percentOfIncome: data.withdrawals.percentOfSalary,
      fill: chartConfig.withdrawals.color,
    },
    {
      metric: "Net contributions",
      amount: data.netContributions.amount,
      percentOfIncome: data.netContributions.percentOfSalary,
      fill: chartConfig.netContributions.color,
    },
  ];

  const liabilityPaymentsData = [
    {
      metric: "Total payments made",
      amount: data.liabilityPaymentData.paymentsMade.amount,
      percentOfIncome: data.liabilityPaymentData.paymentsMade.percentOfSalary,
      fill: chartConfig.totalPaymentsMade.color,
    },
    {
      metric: "Total growth from interest",
      amount: data.liabilityPaymentData.growthFromInterest.amount,
      percentOfIncome:
        data.liabilityPaymentData.growthFromInterest.percentOfSalary,
      fill: chartConfig.totalGrowthFromInterest.color,
    },
  ];

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

  const metrics: TableChartMetric[] = [
    {
      title: "Net worth",
      table: <NetWorthTable data={netWorthData} />,
      chart: <NetWorthChart data={netWorthData} />,
    },
    {
      title: "Category analysis",
      table: <CategoryTable data={categoryData} />,
      chart: <CategoryChart data={categoryData} />,
    },
    {
      title: "Income analysis",
      table: <IncomeTable data={incomeData} />,
      chart: <IncomeChart data={incomeData} />,
    },
    {
      title: "Contribution & Withdrawal analysis",
      table: <AmountAndPercentOfIncomeTable data={contributionData} />,
      chart: <AmountAndPercentOfIncomeChart data={contributionData} />,
    },
    {
      title: "Liability payments",
      table: <AmountAndPercentOfIncomeTable data={liabilityPaymentsData} />,
      chart: <AmountAndPercentOfIncomeChart data={liabilityPaymentsData} />,
    },
  ];

  const statementId = statement.id;

  return (
    <>
      <h1 className="text-xl mb-5">{year} statement</h1>
      <div className="flex flex-col gap-y-10">
        <div>
          <h2>Assets</h2>
          <AssetTable assets={statement.assets} statementId={statementId} />
          <AddEntry entryType="asset" statementId={statementId} />
        </div>
        <div>
          <h2>Liabilities</h2>
          <LiabilityTable
            liabilities={statement.liabilities}
            statementId={statementId}
          />
          <AddEntry entryType="liability" statementId={statementId} />
        </div>
        <ViewSelector />
        {metrics.map((metric) => (
          <div key={metric.title}>
            <h2>{metric.title}</h2>
            {view === "table" ? metric.table : metric.chart}
          </div>
        ))}
      </div>
    </>
  );
}
