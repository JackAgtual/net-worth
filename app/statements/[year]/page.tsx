import { Category, Statement } from "@/lib/db/models";
import dbConnect from "@/lib/db/mongodb";
import NetWorthTable from "./components/net-worth-table";
import AssetTable from "./components/asset-table";
import LiabilityTable from "./components/liability-table";
import CategoryTable from "./components/category-table";
import IncomeTable from "./components/income-table";
import ContributionTable from "./components/contribution-table";

export default async function Page({
  params,
}: {
  params: Promise<{ year: number }>;
}) {
  await dbConnect();
  const { year } = await params;

  const statement = await Statement.findOne({ year });

  if (!statement) return <div>Couldn't find that statement</div>;

  return (
    <>
      <h1>{year} statement</h1>
      <h2>Assets</h2>
      <AssetTable statement={statement} />
      <h2>Liabilities</h2>
      <LiabilityTable statement={statement} />
      <h2>Net worth</h2>
      <NetWorthTable statement={statement} />
      <h2>Category analysis</h2>
      <CategoryTable statement={statement} />
      <h2>Income analysis</h2>
      <IncomeTable statement={statement} />
      <h2>Contribution analysis</h2>
      <ContributionTable statement={statement} />
    </>
  );
}
